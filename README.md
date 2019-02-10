# timetable-bot

SlackBot to generate lt-timetable 🏭

<p align="left">
    <img src="./images/logo.png" alt="timetable-bot" width="30%" height="30%" />
</p>

<p align="left">
    <a href="./LICENSE">
        <img src="http://img.shields.io/badge/License-MIT-lightgray.svg?style=flat" alt="License" />
    </a>
</p>

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

add your talk
```
> @bot add title duration
```

delete my talk
```
> @bot delete
```

generate timetable
```
> @bot show 15:00
```

reschedule all talks
```
> @bot reschedule 17:00
```

clear all talks
```
> @bot clear
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

## Deploy

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Special Thanks 💚

design logo image (Created by [@mutsumi0827](https://github.com/mutsumi0827))
