# timetable-bot

SlackBot to generate lt-timetable 🏭

## Getting Started

Setting `<BOT_TOKEN>`

```sh
echo "bot_token = 'XXX'" > .env
```

Build docker image

```sh
$ docker build -t shinjuku-lt-timetable .
```

Docker run

```
$ docker run -it --name shinjuku-lt-timetable shinjuku-lt-timetable:latest
```

## Usage
Run bot process

```sh
npm run start
```

### command

bot command help
```
> @bot help
```

add your talk ⚡️
```
> @bot add title,duration
```

generate timetable
```
> @bot show 15:00
```

