<?php

use App\Providers\NativeAppServiceProvider;

return [
    /**
     * The version of your app.
     * It is used to determine if the app needs to be updated.
     * Increment this value every time you release a new version of your app.
     */
    'version' => env('NATIVEPHP_APP_VERSION', '1.0.0'),

    /**
     * The ID of your application. This should be a unique identifier
     * usually in the form of a reverse domain name.
     * For example: com.nativephp.app
     */
    'app_id' => env('NATIVEPHP_APP_ID', 'com.nativephp.app'),

    /**
     * Bifrost-generated bundle consumed by NativePHP's secure build path.
     */
    'release_bundle_path' => base_path('build/__nativephp_app_bundle'),

    /**
     * If your application allows deep linking, you can specify the scheme
     * to use here. This is the scheme that will be used to open your
     * application from within other applications.
     * For example: "nativephp"
     *
     * This would allow you to open your application using a URL like:
     * nativephp://some/path
     */
    'deeplink_scheme' => env('NATIVEPHP_DEEPLINK_SCHEME'),

    /**
     * The author of your application.
     */
    'author' => env('NATIVEPHP_APP_AUTHOR'),

    /**
     * The copyright notice for your application.
     */
    'copyright' => env('NATIVEPHP_APP_COPYRIGHT'),

    /**
     * The description of your application.
     */
    'description' => env('NATIVEPHP_APP_DESCRIPTION', 'An awesome app built with NativePHP'),

    /**
     * The Website of your application.
     */
    'website' => env('NATIVEPHP_APP_WEBSITE', 'https://nativephp.com'),

    /**
     * The default service provider for your application. This provider
     * takes care of bootstrapping your application and configuring
     * any global hotkeys, menus, windows, etc.
     */
    'provider' => NativeAppServiceProvider::class,

    /**
     * A list of environment keys that should be removed from the
     * .env file when the application is bundled for production.
     * You may use wildcards to match multiple keys.
     */
    'cleanup_env_keys' => [
        'AWS_*',
        'AZURE_*',
        'GITHUB_*',
        'DO_SPACES_*',
        '*_SECRET',
        'ANTRIAN_SYNC_TOKEN',
        'ANTRIAN_DEVICE_ID',
        'BIFROST_*',
        'NATIVEPHP_UPDATER_PATH',
        'NATIVEPHP_APPLE_ID',
        'NATIVEPHP_APPLE_ID_PASS',
        'NATIVEPHP_APPLE_TEAM_ID',
        'NATIVEPHP_AZURE_PUBLISHER_NAME',
        'NATIVEPHP_AZURE_ENDPOINT',
        'NATIVEPHP_AZURE_CERTIFICATE_PROFILE_NAME',
        'NATIVEPHP_AZURE_CODE_SIGNING_ACCOUNT_NAME',
        'CSC_LINK',
        'CSC_KEY_PASSWORD',
    ],

    /**
     * Release credentials are checked before distributable builds. Values
     * remain environment-owned and are stripped from the packaged app.
     */
    'release_signing' => [
        'azure' => [
            'tenant_id' => env('AZURE_TENANT_ID'),
            'client_id' => env('AZURE_CLIENT_ID'),
            'client_secret' => env('AZURE_CLIENT_SECRET'),
            'publisher_name' => env('NATIVEPHP_AZURE_PUBLISHER_NAME'),
            'endpoint' => env('NATIVEPHP_AZURE_ENDPOINT'),
            'certificate_profile_name' => env('NATIVEPHP_AZURE_CERTIFICATE_PROFILE_NAME'),
            'code_signing_account_name' => env('NATIVEPHP_AZURE_CODE_SIGNING_ACCOUNT_NAME'),
        ],
        'certificate' => [
            'link' => env('CSC_LINK'),
            'password' => env('CSC_KEY_PASSWORD'),
        ],
        'apple' => [
            'id' => env('NATIVEPHP_APPLE_ID'),
            'password' => env('NATIVEPHP_APPLE_ID_PASS'),
            'team_id' => env('NATIVEPHP_APPLE_TEAM_ID'),
        ],
    ],

    /**
     * A list of files and folders that should be removed from the
     * final app before it is bundled for production.
     * You may use glob / wildcard patterns here.
     */
    'cleanup_exclude_files' => [
        'build',
        'temp',
        'content',
        'node_modules',
        '*/tests',
        'tests',
        'docs',
        '.agents',
        '.ai',
        '.claude',
        '.codex',
        '.factory',
        '.junie',
        '.zed',
        '.github',
        'smoke-*.php',
        'storage/app/visual-*',
    ],

    /**
     * The NativePHP updater configuration.
     */
    'updater' => [
        /**
         * Whether or not the updater is enabled. Please note that the
         * updater will only work when your application is bundled
         * for production.
         */
        'enabled' => env('NATIVEPHP_UPDATER_ENABLED', true),

        /**
         * The updater provider to use.
         * Supported: "github", "s3", "spaces"
         * Note: The "s3" provider is compatible with S3-compatible services like Cloudflare R2.
         */
        'default' => env('NATIVEPHP_UPDATER_PROVIDER', 'spaces'),

        'providers' => [
            'github' => [
                'driver' => 'github',
                'repo' => env('GITHUB_REPO'),
                'owner' => env('GITHUB_OWNER'),
                'token' => env('GITHUB_TOKEN'),
                'vPrefixedTagName' => env('GITHUB_V_PREFIXED_TAG_NAME', true),
                'private' => env('GITHUB_PRIVATE', false),
                'autoupdate_token' => env('GITHUB_AUTOUPDATE_TOKEN'), // Read-only token used by the updater for private repos
                'channel' => env('GITHUB_CHANNEL', 'latest'),
                'releaseType' => env('GITHUB_RELEASE_TYPE', 'draft'),
            ],

            's3' => [
                'driver' => 's3',
                'key' => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
                'region' => env('AWS_DEFAULT_REGION'),
                'bucket' => env('AWS_BUCKET'),
                'endpoint' => env('AWS_ENDPOINT'),
                'path' => env('NATIVEPHP_UPDATER_PATH', null),
                /**
                 * Optional public URL for serving updates (e.g., CDN or custom domain).
                 * When set, updates will be downloaded from this URL instead of the S3 endpoint.
                 * Useful for S3 with CloudFront or Cloudflare R2 with public access
                 * Example: 'https://updates.yourdomain.com'
                 */
                'public_url' => env('AWS_PUBLIC_URL'),
            ],

            'spaces' => [
                'driver' => 'spaces',
                'key' => env('DO_SPACES_KEY_ID'),
                'secret' => env('DO_SPACES_SECRET_ACCESS_KEY'),
                'name' => env('DO_SPACES_NAME'),
                'region' => env('DO_SPACES_REGION'),
                'path' => env('NATIVEPHP_UPDATER_PATH', null),
            ],
        ],
    ],

    /**
     * The queue workers that get auto-started on your application start.
     */
    'queue_workers' => [
        'default' => [
            'queues' => ['default'],
            'memory_limit' => 128,
            'timeout' => 60,
            'sleep' => 3,
        ],
    ],

    /**
     * Define your own scripts to run before and after the build process.
     */
    'prebuild' => [
        'npm run build',
    ],

    'postbuild' => [
        // 'rm -rf public/build',
    ],

    /**
     * The NSIS installer configuration for Windows builds.
     *
     * @see https://www.electron.build/generated/nsisoptions
     */
    'nsis' => [
        'delete_app_data_on_uninstall' => env('NATIVEPHP_NSIS_DELETE_APP_DATA', false),
    ],

    /**
     * Custom PHP binary path.
     */
    'binary_path' => env('NATIVEPHP_PHP_BINARY_PATH', null),
];
