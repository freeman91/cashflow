from pprint import pprint
from api.db import database as db
from api.db.__util__ import assert_list_str


def create(
    name: str,
    email: str,
    networth: float,
    income_types=[],
    income_deductions=[],
    income_sources=[],
    expense_types=[],
    expense_vendors=[],
    asset_types=[],
    debt_types=[],
):

    if get():
        delete()

    user = {
        "name": name,
        "email": email,
        "income": {
            "types": income_types,
            "sources": income_sources,
            "deductions": income_deductions,
        },
        "expense": {
            "types": expense_types,
            "vendors": expense_vendors,
        },
        "asset": {
            "types": asset_types,
        },
        "debt": {
            "types": debt_types,
        },
        "networth": networth,
    }

    db.users.insert_one(user)


def _print():
    pprint(get())


def set(user: dict):
    db.users.update_one({"_id": user["_id"]}, {"$set": user})


def get():
    return db.users.find_one()


def get_income_types():
    return get()["income"]["types"]


def delete():
    user = get()
    db.users.delete_one({"_id": user["_id"]})


"""
#### ##    ##  ######   #######  ##     ## ########
 ##  ###   ## ##    ## ##     ## ###   ### ##
 ##  ####  ## ##       ##     ## #### #### ##
 ##  ## ## ## ##       ##     ## ## ### ## ######
 ##  ##  #### ##       ##     ## ##     ## ##
 ##  ##   ### ##    ## ##     ## ##     ## ##
#### ##    ##  ######   #######  ##     ## ########
"""


def update_income_types(types: list[str]):
    assert_list_str(types)

    user = get()
    user["income"]["types"] = types

    set(user)


def get_income_sources():
    return get()["income"]["sources"]


def update_income_sources(sources: list):
    assert_list_str(sources)

    user = get()
    user["income"]["sources"] = sources

    set(user)


def get_income_deductions():
    return get()["income"]["deductions"]


def update_income_deductions(deductions: list):
    assert_list_str(deductions)

    user = get()
    user["income"]["deductions"] = deductions

    set(user)


"""
######## ##     ## ########  ######## ##    ##  ######  ########
##        ##   ##  ##     ## ##       ###   ## ##    ## ##
##         ## ##   ##     ## ##       ####  ## ##       ##
######      ###    ########  ######   ## ## ##  ######  ######
##         ## ##   ##        ##       ##  ####       ## ##
##        ##   ##  ##        ##       ##   ### ##    ## ##
######## ##     ## ##        ######## ##    ##  ######  ########
"""


def get_expense_types():
    return get()["expense"]["types"]


def update_expense_types(types: list):
    assert_list_str(types)

    user = get()
    user["expense"]["types"] = types

    set(user)


def get_expense_vendors():
    return get()["expense"]["vendors"]


def update_expense_vendors(vendors: list):
    assert_list_str(vendors)

    user = get()
    user["expense"]["vendors"] = vendors

    set(user)


"""
   ###     ######   ######  ######## ########
  ## ##   ##    ## ##    ## ##          ##
 ##   ##  ##       ##       ##          ##
##     ##  ######   ######  ######      ##
#########       ##       ## ##          ##
##     ## ##    ## ##    ## ##          ##
##     ##  ######   ######  ########    ##
"""


def get_asset_types():
    return get()["asset"]["types"]


def update_asset_types(types: list):
    assert_list_str(types)

    user = get()
    user["asset"]["types"] = types

    set(user)


"""
########  ######## ########  ########  ######
##     ## ##       ##     ##    ##    ##    ##
##     ## ##       ##     ##    ##    ##
##     ## ######   ########     ##     ######
##     ## ##       ##     ##    ##          ##
##     ## ##       ##     ##    ##    ##    ##
########  ######## ########     ##     ######
"""


def get_debt_types():
    return get()["debt"]["types"]


def update_debt_types(types: list):
    assert_list_str(types)

    user = get()
    user["debt"]["types"] = types

    set(user)


"""
##    ## ######## ######## ##      ##  #######  ########  ######## ##     ##
###   ## ##          ##    ##  ##  ## ##     ## ##     ##    ##    ##     ##
####  ## ##          ##    ##  ##  ## ##     ## ##     ##    ##    ##     ##
## ## ## ######      ##    ##  ##  ## ##     ## ########     ##    #########
##  #### ##          ##    ##  ##  ## ##     ## ##   ##      ##    ##     ##
##   ### ##          ##    ##  ##  ## ##     ## ##    ##     ##    ##     ##
##    ## ########    ##     ###  ###   #######  ##     ##    ##    ##     ##
"""


def get_networth():
    return get()["networth"]


def update_networth(networth: float):
    assert type(networth) == float or type(networth) == int

    user = get()
    user["networth"] = networth

    set(user)
