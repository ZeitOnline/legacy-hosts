# Erzeugt eine Ausgabenseite (Centerpage, die zu einem Ausgabenobjekt gehört)
# und bestückt sie mit Autoflächen für die Ressorts, die in
# http://vivi.zeit.de/repository/data/print-ressorts.xml stehen.
# Unglücklicherweise gibt es Sonderfälle für Zeit Österreich etc., da diese nur anhand
# der Product ID und nicht über das Ressort identifiziert werden können. Für Hamburg
# ist dies aber möglich...

# === Einstellungen ===

CP_TITLE = "DIE ZEIT: Ausgabe {name} / {year} | Archiv | ZEIT ONLINE"

CP_DESCRIPTION = "Lesen Sie alle Artikel der Wochenzeitung DIE ZEIT aus der Ausgabe {name} des Jahres {year} online."

RESSORT_QUERY = """\
ns-print-ressort:"{ressort}" published:"published"
year:{year} volume:{name} {product_query}
"""
RESSORT_SORTING = """\
(access:"abo"^200 OR access:"registration"^100 OR access:"free")
"""

RESSORT_ORDER = "score desc, page asc"

# Alle Teaser eines Ressorts sollen enthalten sein, daher stellen wir eine
# (hoffentlich) ausreichend hohe Anzahl ein.
ANZAHL_TEASER_PRO_RESSORTFLAECHE = 50

# Regionale Produkte (Osten, Oesterreich, Schweiz)
REGIONAL_PRODUCT_IDS = ['ZESA', 'ZEOE', 'ZECH']

REGIONAL_RESSORT_QUERY = """\
published:"published"
year:{year} volume:{name} {product_query}
"""

# === Code (ab hier nur anfassen, wenn man weiß, was man tut :-) ===

import zeit.solr.query
import zeit.cms.content.sources
import zeit.content.cp.centerpage
import zeit.content.cp.interfaces
import zeit.content.cp.layout
import zeit.seo.interfaces
import zope.interface

cp = zeit.content.cp.centerpage.CenterPage()
zope.interface.alsoProvides(cp, zeit.content.cp.interfaces.ICP2015)
cp.body.clear()
volume = context['volume']

# Metadaten
cp.type = u'volume'
cp.year = volume.year
cp.volume = volume.volume
cp.product = volume.product
cp.title = volume.fill_template(CP_TITLE)
zeit.seo.interfaces.ISEO(cp).html_description = volume.fill_template(
    CP_DESCRIPTION)

# Header
region = cp.body.create_item('region')
region.kind = 'solo'
header = region.create_item('area')
header.kind = 'volume-header'

# Product Query
try:
    Q = zeit.solr.query
    product_ids = [volume.product.id] + [
        x.id for x in volume.product.dependent_products]
    ressort_product_query = Q.or_(*[Q.field('product_id', x) for x in product_ids])
except AttributeError:
    ressort_product_query = 'product_id:{}'.format(volume.product.id)


def add_area(title, query):
    region = cp.body.create_item('region')
    region.kind = 'solo'
    area = region.create_item('area')
    area.kind = 'print-ressort'
    area.title = title

    area.automatic_type = 'query'
    area.hide_dupes = True
    area.count = ANZAHL_TEASER_PRO_RESSORTFLAECHE
    area.automatic = True

    area.require_lead_candidates = False
    area.values()[0].layout = zeit.content.cp.layout.get_layout('zon-large')

    query = query + RESSORT_SORTING
    query = query.replace('\n', ' ').strip()
    area.raw_query = query
    area.raw_order = RESSORT_ORDER

# Create list of title and querystring for areas
to_add = []

# Ressorts
ressort_source = zeit.cms.content.sources.PRINT_RESSORT_SOURCE(None)
for ressort in list(ressort_source):
    title = ressort_source.factory.getTitle(None, ressort)
    query = unicode(RESSORT_QUERY).format(
        ressort=ressort,
        year=volume.year,
        name=volume.volume,
        product_query=ressort_product_query)
    to_add.append((title, query))

# Regional Products
product_source = zeit.cms.content.sources.PRODUCT_SOURCE(None)
for regional_product_id in REGIONAL_PRODUCT_IDS:
    title = product_source.find(regional_product_id).title
    query = unicode(REGIONAL_RESSORT_QUERY).format(
        year=volume.year,
        name=volume.volume,
        product_query='product_id:{}'.format(regional_product_id))
    to_add.append((title, query))

# And add them to the cp
for title, query in to_add:
    add_area(title, query)

__return(cp)