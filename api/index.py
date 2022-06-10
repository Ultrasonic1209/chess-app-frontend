import sanic, sanic.response, ujson
from sanic import Sanic
from sanic.response import json

from sanic_ext import Config

from a2wsgi import ASGIMiddleware

api = Sanic("CheckmateBackend")

app = ASGIMiddleware(api)

api.extend(config=Config(
    oas=True,
    oas_autodoc=True,
    oas_ui_default="swagger"
))

@api.middleware('response')
async def add_json(request: sanic.Request, response: sanic.response.HTTPResponse):
    if response.content_type == "application/json":
        parsed = ujson.loads(response.body)

        parsed["chess"] = "cool"

        new_response = json(parsed, status=response.status, headers=response.headers)

        return new_response
    else:
        return None

@api.get("/")
@api.route('/<path:path>',methods=["GET","POST"])
async def index(request, path=""):
    return json({"message": "Hello, world.", "path": path})

if __name__ == '__main__':
    api.run(host='0.0.0.0', port=8080, fast=True)