# Медиа сервер

Environment settings:

```bash
github.com/rs/zerolog#Level
LOG_LEVEL=1

# Public IP for server under VPN if empty doesn't use
PUBLIC_IP=
# Http port for web-rtc
HTTP_PORT=8005
# Udp port for ufrag
UDP_PORT=8055
# Public url for web-rtc clients
WEB_RTC_PUBLIC_URL=http://localhost:8005/video

RMQ_CONN_URL=amqp://guest:guest@rabbitmq:5672/

RMQ_NOTIFY_EXCHANGE=notify
RMQ_NOTIFY_ROUTING_KEY=notify.*
# If true or yeas or y or 1 enable autocreate queue if exchange doesn't exists
RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED=Y

RMQ_STREAM_EXCHANGE=stream
# If true or yeas or y or 1 enable autocreate queue if exchange doesn't exists
RMQ_STREAM_ON_LIVE_BROADCAST_ROUTING_KEY=stream.OnLiveBroadcast
RMQ_STREAM_ON_LIVE_BROADCAST_STATUS_ROUTING_KEY=stream.OnLiveBroadcastStatus
RMQ_STREAM_EXCHANGE_AUTOCREATE_ENABLED=Y

RMQ_CHAT_EXCHANGE=status-chat
RMQ_CHAT_ROUTING_KEY=status-chat.*
# If true or yeas or y or 1 enable autocreate queue if exchange doesn't exists
RMQ_CHAT_EXCHANGE_AUTOCREATE_ENABLED=Y

# If omit by default 1s
SEND_STATISTICS_MESSAGE_INTERVAL=1s

# If omit by default 30s
DEAD_TRANSLATION_TIMEOUT=30s

# Queue listener settings ============
RMQ_EXCHANGE=live-stream
RMQ_QUEUE_CONSUME=LIVE_STREAM_QUEUE
RMQ_BINDING_CONSUME=live-stream.*
RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED=

# Secret key like in django
SECRET_KEY=super_secret_key_very_long
```

## Additional information

### Publish

You can publish via an tool that supports WHIP or via your browser. To publish via your browser open [http://localhost:8005](http://localhost:8005), and press publish.

To publish via OBS set `Service` to `WHIP` and `Server` to `http://localhost:8005/whip`. The `Bearer Token` can be whatever value you like.

### Subscribe

Once you have started publishing open [http://localhost:8005](http://localhost:8005) and press the subscribe button. You can now view your video you published via
OBS or your browser.

Congrats, you have used Pion WebRTC! Now start building something cool

## Why WHIP/WHEP?

WHIP/WHEP mandates that a Offer is uploaded via HTTP. The server responds with a Answer. With this strong API contract WebRTC support can be added to tools like OBS.

For more info on WHIP/WHEP specification, feel free to read some of these great resources:

- <https://webrtchacks.com/webrtc-cracks-the-whip-on-obs/>
- <https://datatracker.ietf.org/doc/draft-ietf-wish-whip/>
- <https://datatracker.ietf.org/doc/draft-ietf-wish-whep/>
- <https://bloggeek.me/whip-whep-webrtc-live-streaming>

Принимает сообщения от м.сервиса stream-streamer-service  
