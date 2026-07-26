<?php

declare(strict_types=1);

use Pest\Kernel;
use Pest\TestSuite;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\ConsoleOutput;

$rootPath = dirname(__DIR__);
putenv('APP_BASE_PATH='.$rootPath);
$_ENV['APP_BASE_PATH'] = $rootPath;
$_SERVER['APP_BASE_PATH'] = $rootPath;

$loader = require $rootPath.'/vendor/autoload.php';
$sharedRoot = dirname((string) realpath($rootPath.'/vendor'));
$worktreeClassMap = [];

foreach ($loader->getClassMap() as $class => $path) {
    $resolvedPath = realpath($path);

    if (is_string($resolvedPath) && str_starts_with($resolvedPath, $sharedRoot.DIRECTORY_SEPARATOR)) {
        $worktreeClassMap[$class] = $rootPath.substr($resolvedPath, strlen($sharedRoot));
    }
}

$loader->addClassMap($worktreeClassMap);
$loader->setPsr4('App\\', [$rootPath.'/app']);
$loader->setPsr4('Database\\Factories\\', [$rootPath.'/database/factories']);
$loader->setPsr4('Database\\Seeders\\', [$rootPath.'/database/seeders']);
$loader->setPsr4('Tests\\', [$rootPath.'/tests']);

$input = new ArgvInput;
$output = new ConsoleOutput;
$suite = TestSuite::getInstance($rootPath, 'tests');
$kernel = Kernel::boot($suite, $input, $output);
$result = $kernel->handle($_SERVER['argv'], $_SERVER['argv']);
$kernel->terminate();

exit($result);
