# Setup

In case you want to do changes to turnilo itself, it is often quicker to use the wikipedia example
set. If you want to test a new config or debug a Remerge specific issue, this section describes how
to run a local turnilo with the production data set.

Follow the general turnilo setup described in [README.md](./README.md#development)

1. Copy the current production config from `chef.new/cookbooks/turnilo/templates/config.yaml`
  - Change the `host` entry to point to a druid broker (`broker1.dw1.remerge.io:8082`)
  - Change the line `requestDecorator: "./current/request-deadline-decorator.js"` to `requestDecorator: "./request-deadline-decorator.js"`

2. Connect to our cluster via [VPN](https://remerge.atlassian.net/wiki/spaces/tech/pages/66191582/VPN+setup+-+IPsec+for+macOS+clients)

3. Build and start turnilo
```
npm run build:dev
npm run start:dev -- --config config.yaml
```
