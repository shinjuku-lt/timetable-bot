# timetable-bot

SlackBot to generate lt-timetable 🏭

using [BotKit slash-commands](https://botkit.ai/docs/readme-slack.html#slash-commands)

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
export SLACK_CLIENT_ID = 'XXX'
export SLACK_CLIENT_ID = 'XXX'
```

Use of [direnv](https://github.com/direnv/direnv) is recommended.

## Usage
Run bot process

```sh
npm run start
```

## Command

### add your talk
args
- test: talk title
- 10: duration
```
/lt_add_talk test 10
```

### delete my talk
```
/lt_delete_talk
```

### show timetable
args
- 15:00: start date
```
/lt_show_timetable 15:00
```

### reschedule timetable
args
- 15:30: reschedule date
```
/lt_reschedule_timetable 15:30
```

### clear timetable
```
/lt_clear_timetable
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

