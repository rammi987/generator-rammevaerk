import path     from 'path';
import test     from 'ava';
import helpers  from 'yeoman-test';
import assert   from 'yeoman-assert';
import pify     from 'pify';

let generator;

test.beforeEach(async () => {
    await pify(helpers.testDirectory)(path.join(__dirname, 'temp'));
    generator = helpers.createGenerator('rammevaerk:app', ['../../app'], null, { 'skipInstall': true, 'keep-silence': true });
});

test.serial('generates expected files', async () => {

    helpers.mockPrompt(generator, {
        projectName: 'avaTest'
    });

    await pify(generator.run.bind(generator))();

    const expected = [
        '.editorconfig',
        '.eslintrc',
        '.stylelintrc',
        'webpack.config.js',
        'gulpfile.js',
        'package.json',
        'README.md'
    ];

    assert.file(expected);
});

test.serial('generates expected dependencies', async () => {

    helpers.mockPrompt(generator, {
        projectName: 'avaTest'
    });

    await pify(generator.run.bind(generator))();

    assert.JSONFileContent('package.json', {"name": "AvaTest"});
});


test.serial('generates capitalized kebabcase name', async () => {

    helpers.mockPrompt(generator, {
        projectName: 'a v a t e s t'
    });

    await pify(generator.run.bind(generator))();

    assert.file('A-v-a-t-e-s-t.Website');

});
