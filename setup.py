from setuptools import setup, find_packages

setup(
    name='legacy_hosts',
    version='0.1.dev0',
    description='Server (old) static content for ZON',
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Pyramid',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application',
    ],
    author='Ron Drongowski',
    author_email='ron.drongowski@zeit.de',
    url='images.zeit.de',
    keywords='web pyramid pylons',
    setup_requires=['setuptools_git'],
    namespace_packages=['legacy_hosts'],
    packages=find_packages('src'),
    package_dir={'': 'src'},
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'pyramid',
        'waitress'],
    entry_points={
        'paste.app_factory': [
            'factory = legacy_hosts.application:factory',
        ],
    },
)
