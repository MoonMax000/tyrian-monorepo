tank:
	docker run -v $(shell pwd):/var/loadtest -v $SSH_AUTH_SOCK:/ssh-agent -e SSH_AUTH_SOCK=/ssh-agent \
		--net host \
		-it yandex/yandex-tank

make-ammo-post:
	echo "POST||/uri/path|||| {\"key\":\"value\", \"key\":\"value\"}" |  python3 make_ammo.py > ammo.txt
