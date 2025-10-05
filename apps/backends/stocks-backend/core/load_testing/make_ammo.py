#!/usr/bin/python3
# -*- coding: utf-8 -*-
import requests
import sys


def print_request(request):
    method = request.method.encode()
    path_url = request.path_url.encode()
    headers = (
        "".join("{0}: {1}\r\n".format(k, v) for k, v in request.headers.items())
    ).encode()
    body = (request.body or "").encode()
    req = b"".join([method, b" ", path_url, b" HTTP/1.1\r\n", headers, b"\r\n", body])
    req_size = str(len(req)).encode()
    return b"".join([req_size, b"\n", req, b"\r\n"])


# POST multipart form data
def post_multipart(host, port, namespace, files, headers, payload):
    req = requests.Request(
        "POST",
        "https://{host}:{port}{namespace}".format(
            host=host,
            port=port,
            namespace=namespace,
        ),
        headers=headers,
        data=payload,
        files=files,
    )
    prepared = req.prepare()
    return print_request(prepared)


# POST
def post(host, port, namespace, headers, payload):
    req = requests.Request(
        "POST",
        "https://{host}:{port}{namespace}".format(
            host=host,
            port=port,
            namespace=namespace,
        ),
        headers=headers,
        data=payload,
    )
    prepared = req.prepare()
    return print_request(prepared)


if __name__ == "__main__":
    # usage sample below
    # target's hostname and port
    # this will be resolved to IP for TCP connection
    host = "localhost"
    port = "8000"
    namespace = "/api/v1/auth/login/"
    # below you should specify or able to operate with
    # virtual server name on your target
    headers = {
        "Host": "hostname.com",
        "User-Agent": "tank",
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Connection": "keep-alive",
    }

    payload = {"email": "test@test.com", "password": "test"}

    sys.stdout.buffer.write(post(host, port, namespace, headers, payload))
