# timetable-bot

SlackBot to generate lt-timetable 🏭

## Getting Started

Setting `<BOT_TOKEN>`

```sh
export BOT_TOKEN = 'XXX'
```

Use of [direnv](https://github.com/direnv/direnv) is recommended.

## Usage
Run bot process

```sh
npm run start
```

### Command

bot command help
```
> @bot help
```

add your talk ⚡️
```
> @bot add title,duration
```

clear all talks
```
> @bot clear
```

generate timetable
```
> @bot show 15:00
```

## (Option) Pro Tips 👌

Build docker image

```sh
docker build -t timetable-bot .
```

Docker run

```sh
docker run -it --name timetable-bot timetable-bot:latest
```
