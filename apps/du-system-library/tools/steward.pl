#!/usr/bin/env perl

use strict;
use warnings;
use utf8;

use Getopt::Long qw(GetOptions);
use File::Find;
use File::Copy qw(move copy);
use File::Path qw(make_path);
use File::Basename qw(dirname basename fileparse);
use File::Spec;
use POSIX qw(strftime);
use Digest::MD5 qw(md5_hex);
use JSON::PP qw(encode_json);

binmode STDOUT, ':encoding(UTF-8)';
binmode STDERR, ':encoding(UTF-8)';

# --------------------------------------------------
# CLI / CONFIG
# --------------------------------------------------

my %CONFIG = (
    source_root      => 'tree',
    domain_root      => 'domains',
    harvest_root     => '',
    ledger_file      => '',
    index_file       => '',
    manifest_file    => '',
    repo_map_file    => '',
    dry_run          => 0,
    copy_assets      => 0,
    remove_sidecars  => 0,
    verbose          => 1,
    domain_filter    => '',
    docs_only        => 0,
    assets_only      => 0,
);

GetOptions(
    'source-root=s'      => \$CONFIG{source_root},
    'domain-root=s'      => \$CONFIG{domain_root},
    'domain=s'           => \$CONFIG{domain_filter},
    'dry-run!'           => \$CONFIG{dry_run},
    'copy-assets!'       => \$CONFIG{copy_assets},
    'remove-sidecars!'   => \$CONFIG{remove_sidecars},
    'verbose!'           => \$CONFIG{verbose},
    'docs-only!'         => \$CONFIG{docs_only},
    'assets-only!'       => \$CONFIG{assets_only},
    'help!'              => \my $help,
) or die usage();

if ($help) {
    print usage();
    exit 0;
}

if ($CONFIG{docs_only} && $CONFIG{assets_only}) {
    die "--docs-only and --assets-only cannot be used together\n";
}

$CONFIG{harvest_root}  = File::Spec->catdir($CONFIG{domain_root}, '_harvest');
$CONFIG{ledger_file}   = File::Spec->catfile($CONFIG{harvest_root}, 'harvest-ledger.log');
$CONFIG{index_file}    = File::Spec->catfile($CONFIG{harvest_root}, 'harvest-index.md');
$CONFIG{manifest_file} = File::Spec->catfile($CONFIG{harvest_root}, 'harvest-manifest.json');
$CONFIG{repo_map_file} = File::Spec->catfile($CONFIG{harvest_root}, 'repo-map.md');

my %DOC_EXT = map { $_ => 1 } qw(.md .markdown);
my %ASSET_EXT = map { $_ => 1 } qw(
    .png .jpg .jpeg .webp .svg .gif .mp3 .wav .ogg .pdf .json .txt
);

my @doc_candidates;
my @asset_candidates;
my @harvested;
my %asset_lookup;
my %slug_lookup;
my %manifest;

# --------------------------------------------------
# MAIN
# --------------------------------------------------

bootstrap();
scan_tree();
harvest_assets_first() unless $CONFIG{docs_only};
harvest_docs_second()   unless $CONFIG{assets_only};
write_ledger();
write_index();
write_manifest();
write_repo_map();

log_info("");
log_info("Steward complete.");
log_info("Processed items: " . scalar(@harvested));

exit 0;

# --------------------------------------------------
# USAGE
# --------------------------------------------------

sub usage {
    return <<'USAGE';
Usage:
  perl steward.pl [options]

Options:
  --source-root PATH       Source staging tree (default: tree)
  --domain-root PATH       Canonical domain root (default: domains)
  --domain NAME            Only harvest entries for one domain
  --dry-run                Show planned actions without changing files
  --copy-assets            Copy assets instead of moving them
  --remove-sidecars        Remove asset .meta/.txt sidecars after move
  --docs-only              Process docs only
  --assets-only            Process assets only
  --verbose                Enable verbose logging
  --no-verbose             Disable verbose logging
  --help                   Show this help

Examples:
  perl steward.pl --dry-run
  perl steward.pl --domain engine
  perl steward.pl --assets-only
  perl steward.pl --docs-only --dry-run
  perl steward.pl --source-root tree --domain-root domains
USAGE
}

# --------------------------------------------------
# BOOTSTRAP
# --------------------------------------------------

sub bootstrap {
    ensure_parent_dirs(
        $CONFIG{ledger_file},
        $CONFIG{index_file},
        $CONFIG{manifest_file},
        $CONFIG{repo_map_file},
    );

    %manifest = (
        generated_at => now_iso(),
        source_root  => $CONFIG{source_root},
        domain_root  => $CONFIG{domain_root},
        domain_filter => $CONFIG{domain_filter},
        dry_run      => $CONFIG{dry_run} ? JSON::PP::true : JSON::PP::false,
        entries      => [],
    );

    log_info("Bootstrap complete.");
    log_info("source_root: $CONFIG{source_root}");
    log_info("domain_root: $CONFIG{domain_root}");
    log_info("domain_filter: " . ($CONFIG{domain_filter} || '(none)'));
    log_info("mode: " . mode_string());
}

sub mode_string {
    return 'docs-only'   if $CONFIG{docs_only};
    return 'assets-only' if $CONFIG{assets_only};
    return 'full';
}

# --------------------------------------------------
# SCAN
# --------------------------------------------------

sub scan_tree {
    die "Source root does not exist: $CONFIG{source_root}\n"
        unless -d $CONFIG{source_root};

    find(
        {
            wanted   => \&scan_path,
            no_chdir => 1,
        },
        $CONFIG{source_root}
    );

    log_info("Scanned tree.");
    log_info("Docs discovered: " . scalar(@doc_candidates));
    log_info("Assets discovered: " . scalar(@asset_candidates));
}

sub scan_path {
    my $path = $File::Find::name;
    return if -d $path;

    my ($name, $dir, $ext) = fileparse($path, qr/\.[^.]*/);
    $ext = lc($ext // '');

    if ($DOC_EXT{$ext}) {
        push @doc_candidates, $path;
    }
    elsif ($ASSET_EXT{$ext}) {
        push @asset_candidates, $path;
    }
}

# --------------------------------------------------
# HARVEST ORDER
# --------------------------------------------------

sub harvest_assets_first {
    for my $path (@asset_candidates) {
        process_asset($path);
    }
}

sub harvest_docs_second {
    for my $path (@doc_candidates) {
        process_doc($path);
    }
}

# --------------------------------------------------
# DOC HARVEST
# --------------------------------------------------

sub process_doc {
    my ($path) = @_;

    my $content = slurp($path);
    my ($meta, $body) = parse_frontmatter($content);

    return unless should_harvest($meta);
    return unless passes_domain_filter($meta->{domain});

    my $domain = $meta->{domain} || 'misc';
    my $slug   = $meta->{slug}   || safe_slug(basename($path));
    my $kind   = $meta->{kind}   || 'doc';

    my $dest_dir  = File::Spec->catdir($CONFIG{domain_root}, $domain, 'docs');
    my $dest_file = File::Spec->catfile($dest_dir, "$slug.md");

    make_path($dest_dir) unless -d $dest_dir;

    my $rewritten_body = rewrite_markdown_links(
        body          => $body,
        original_path => $path,
        final_doc     => $dest_file,
    );

    my $normalized = rebuild_frontmatter($meta) . $rewritten_body;

    if ($CONFIG{dry_run}) {
        log_info("[DRY] DOC   $path -> $dest_file");
    } else {
        write_file($dest_file, $normalized);
        unlink $path or warn "Could not remove original doc $path: $!";
        log_info("DOC   $path -> $dest_file");
    }

    my $entry = {
        timestamp => now_iso(),
        type      => 'doc',
        source    => $path,
        dest      => $dest_file,
        domain    => $domain,
        slug      => $slug,
        kind      => $kind,
        status    => $meta->{status} || '',
        checksum  => md5_hex($normalized),
    };

    record_harvest($entry);
}

# --------------------------------------------------
# ASSET HARVEST
# --------------------------------------------------

sub process_asset {
    my ($path) = @_;

    my $meta = read_asset_sidecar($path);
    return unless should_harvest($meta);
    return unless passes_domain_filter($meta->{domain});

    my ($name, $dir, $ext) = fileparse($path, qr/\.[^.]*/);

    my $domain = $meta->{domain} || 'misc';
    my $slug   = $meta->{slug}   || safe_slug($name);
    my $kind   = $meta->{kind}   || 'asset';

    my $dest_dir  = File::Spec->catdir($CONFIG{domain_root}, $domain, 'assets');
    my $dest_file = File::Spec->catfile($dest_dir, $slug . lc($ext));

    make_path($dest_dir) unless -d $dest_dir;

    if ($CONFIG{dry_run}) {
        log_info("[DRY] ASSET $path -> $dest_file");
    } else {
        if ($CONFIG{copy_assets}) {
            copy($path, $dest_file) or die "Copy failed $path -> $dest_file: $!";
        } else {
            move($path, $dest_file) or die "Move failed $path -> $dest_file: $!";
        }
        log_info("ASSET $path -> $dest_file");

        if ($CONFIG{remove_sidecars}) {
            cleanup_asset_sidecars($path);
        }
    }

    my $abs_source = canon_path($path);
    my $abs_dest   = canon_path($dest_file);

    $asset_lookup{$abs_source}      = $abs_dest;
    $slug_lookup{"asset:$slug"}     = $abs_dest;

    my $entry = {
        timestamp => now_iso(),
        type      => 'asset',
        source    => $path,
        dest      => $dest_file,
        domain    => $domain,
        slug      => $slug,
        kind      => $kind,
        status    => $meta->{status} || '',
        checksum  => ($CONFIG{dry_run} ? '' : file_checksum($dest_file)),
    };

    record_harvest($entry);
}

# --------------------------------------------------
# MARKDOWN REWRITING
# --------------------------------------------------

sub rewrite_markdown_links {
    my %args = @_;
    my $body          = $args{body};
    my $original_path = $args{original_path};
    my $final_doc     = $args{final_doc};

    my $original_dir = dirname($original_path);
    my $final_dir    = dirname($final_doc);

    $body =~ s{
        (!?\[[^\]]*\]\()([^)]+)(\))
    }{
        my ($prefix, $target, $suffix) = ($1, $2, $3);
        my $new_target = rewrite_target(
            target       => $target,
            original_dir => $original_dir,
            final_dir    => $final_dir,
        );
        $prefix . $new_target . $suffix
    }gex;

    return $body;
}

sub rewrite_target {
    my %args = @_;
    my $target       = $args{target};
    my $original_dir = $args{original_dir};
    my $final_dir    = $args{final_dir};

    return $target if $target =~ m{^(https?:|mailto:|#)};
    return $target if $target =~ /^\s*$/;

    my ($path_only, $anchor) = split_anchor($target);

    my $resolved_source = canon_path(
        File::Spec->rel2abs($path_only, $original_dir)
    );

    my $final_target;

    if (exists $asset_lookup{$resolved_source}) {
        $final_target = $asset_lookup{$resolved_source};
    } else {
        my ($name) = fileparse($path_only, qr/\.[^.]*/);
        my $slug = safe_slug($name);
        if (exists $slug_lookup{"asset:$slug"}) {
            $final_target = $slug_lookup{"asset:$slug"};
        }
    }

    return $target unless $final_target;

    my $relative = File::Spec->abs2rel($final_target, $final_dir);
    $relative =~ s{\\}{/}g;

    return defined $anchor ? "$relative#$anchor" : $relative;
}

sub split_anchor {
    my ($target) = @_;
    if ($target =~ /^(.*)#([^#]+)$/) {
        return ($1, $2);
    }
    return ($target, undef);
}

# --------------------------------------------------
# METADATA
# --------------------------------------------------

sub parse_frontmatter {
    my ($content) = @_;
    my %meta;

    if ($content =~ s/\A---\s*\n(.*?)\n---\s*\n//s) {
        my $fm = $1;
        for my $line (split /\n/, $fm) {
            next if $line =~ /^\s*#/;
            next unless $line =~ /^\s*([^:]+?)\s*:\s*(.*?)\s*$/;
            my ($k, $v) = (lc($1), $2);
            $meta{$k} = $v;
        }
    }

    return (\%meta, $content);
}

sub rebuild_frontmatter {
    my ($meta) = @_;
    return '' unless %$meta;

    my @keys = sort keys %$meta;
    my $out = "---\n";
    for my $k (@keys) {
        my $v = defined $meta->{$k} ? $meta->{$k} : '';
        $out .= "$k: $v\n";
    }
    $out .= "---\n\n";
    return $out;
}

sub read_asset_sidecar {
    my ($asset_path) = @_;
    my %meta;

    my ($name, $dir, $ext) = fileparse($asset_path, qr/\.[^.]*/);
    my @candidates = (
        File::Spec->catfile($dir, "$name.meta"),
        File::Spec->catfile($dir, "$name.txt"),
    );

    for my $sidecar (@candidates) {
        next unless -f $sidecar;
        my $txt = slurp($sidecar);
        for my $line (split /\n/, $txt) {
            next if $line =~ /^\s*#/;
            next unless $line =~ /^\s*([^=]+?)\s*=\s*(.*?)\s*$/;
            my ($k, $v) = (lc($1), $2);
            $meta{$k} = $v;
        }
        last;
    }

    return \%meta;
}

sub cleanup_asset_sidecars {
    my ($asset_path) = @_;
    my ($name, $dir, $ext) = fileparse($asset_path, qr/\.[^.]*/);

    for my $sidecar (
        File::Spec->catfile($dir, "$name.meta"),
        File::Spec->catfile($dir, "$name.txt"),
    ) {
        next unless -f $sidecar;
        unlink $sidecar or warn "Could not remove sidecar $sidecar: $!";
    }
}

sub should_harvest {
    my ($meta) = @_;
    return 0 unless $meta && %$meta;
    return 0 unless defined $meta->{status};
    return 0 unless lc($meta->{status}) eq 'harvest-ready';
    return 1;
}

sub passes_domain_filter {
    my ($domain) = @_;
    return 1 unless $CONFIG{domain_filter};
    $domain ||= 'misc';
    return lc($domain) eq lc($CONFIG{domain_filter});
}

# --------------------------------------------------
# OUTPUTS
# --------------------------------------------------

sub record_harvest {
    my ($entry) = @_;
    push @harvested, $entry;
    push @{ $manifest{entries} }, $entry;
}

sub write_ledger {
    return unless @harvested;

    open my $fh, '>>:encoding(UTF-8)', $CONFIG{ledger_file}
        or die "Cannot open ledger $CONFIG{ledger_file}: $!";

    for my $h (@harvested) {
        print $fh join(
            " | ",
            $h->{timestamp},
            $h->{type},
            "domain=$h->{domain}",
            "slug=$h->{slug}",
            "kind=$h->{kind}",
            "status=$h->{status}",
            "src=$h->{source}",
            "dest=$h->{dest}",
            "md5=$h->{checksum}",
        ), "\n";
    }

    close $fh;
}

sub write_index {
    my %by_domain;

    for my $h (@harvested) {
        push @{ $by_domain{ $h->{domain} } }, $h;
    }

    my $out = "# Harvest Index\n\n";
    $out .= "Generated: " . now_iso() . "\n\n";

    if (!@harvested) {
        $out .= "_No items harvested in this run._\n";
        write_file($CONFIG{index_file}, $out);
        return;
    }

    for my $domain (sort keys %by_domain) {
        $out .= "## $domain\n\n";
        for my $h (@{ $by_domain{$domain} }) {
            $out .= "- **$h->{slug}** ($h->{type}, $h->{kind})  \n";
            $out .= "  - Source: `$h->{source}`  \n";
            $out .= "  - Dest: `$h->{dest}`  \n";
            $out .= "  - Timestamp: `$h->{timestamp}`\n";
        }
        $out .= "\n";
    }

    write_file($CONFIG{index_file}, $out);
}

sub write_manifest {
    my $json = JSON::PP->new->utf8->pretty->canonical->encode(\%manifest);
    write_file($CONFIG{manifest_file}, $json);
}

sub write_repo_map {
    my %domains;

    for my $entry (@{ $manifest{entries} }) {
        push @{ $domains{ $entry->{domain} }{ $entry->{type} } }, $entry;
    }

    my $out = "# Repo Map\n\n";
    $out .= "Generated: " . now_iso() . "\n\n";

    if (!%domains) {
        $out .= "_No harvested entries available._\n";
        write_file($CONFIG{repo_map_file}, $out);
        return;
    }

    for my $domain (sort keys %domains) {
        $out .= "## $domain\n\n";

        for my $type (sort keys %{ $domains{$domain} }) {
            $out .= "### $type\n\n";

            for my $entry (sort { $a->{slug} cmp $b->{slug} } @{ $domains{$domain}{$type} }) {
                $out .= "- `$entry->{dest}` — $entry->{kind}\n";
            }

            $out .= "\n";
        }
    }

    write_file($CONFIG{repo_map_file}, $out);
}

# --------------------------------------------------
# HELPERS
# --------------------------------------------------

sub slurp {
    my ($path) = @_;
    open my $fh, '<:encoding(UTF-8)', $path
        or die "Cannot read $path: $!";
    local $/;
    my $txt = <$fh>;
    close $fh;
    return $txt;
}

sub write_file {
    my ($path, $content) = @_;
    ensure_parent_dirs($path);
    open my $fh, '>:encoding(UTF-8)', $path
        or die "Cannot write $path: $!";
    print $fh $content;
    close $fh;
}

sub ensure_parent_dirs {
    for my $path (@_) {
        my $dir = dirname($path);
        make_path($dir) unless -d $dir;
    }
}

sub canon_path {
    my ($path) = @_;
    my $abs = File::Spec->rel2abs($path);
    $abs =~ s{\\}{/}g;
    return $abs;
}

sub safe_slug {
    my ($s) = @_;
    $s =~ s/\.[^.]+$//;
    $s = lc($s);
    $s =~ s/[^a-z0-9]+/-/g;
    $s =~ s/^-+//;
    $s =~ s/-+$//;
    return $s || 'untitled';
}

sub now_iso {
    return strftime("%Y-%m-%dT%H:%M:%S%z", localtime);
}

sub file_checksum {
    my ($path) = @_;
    return '' unless -f $path;
    open my $fh, '<', $path or return '';
    binmode($fh);
    local $/;
    my $data = <$fh>;
    close $fh;
    return md5_hex($data // '');
}

sub log_info {
    my ($msg) = @_;
    print "$msg\n" if $CONFIG{verbose};
}

