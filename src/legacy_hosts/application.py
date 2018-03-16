from pyramid.config import Configurator
import logging
from pyramid.static import static_view


static_view = static_view('/content', use_subpath=True)
log = logging.getLogger(__name__)


def main(global_config, **settings):
    with Configurator() as config:
        config.setup_registry(settings=settings)
        config.add_route('static', '/*subpath')
        config.add_view('legacy_hosts.application.static_view',
                        route_name='static')
        config.add_static_view(
            name='static', path='/')
        return config.make_wsgi_app()


factory = main
