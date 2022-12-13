Subgraph
---
- Deploy to local node:
  ```yarn eth-prod-local```

- Deploy to AWS:
  ```yarn eth-prod-aws```

Subgraph bot
---

- Port: 3016

- Running bot locally:
  ```$yarn eth-prod-aws```

- Local API route:
  http://localhost:3016/gro_together/all_collectives?subgraph=prod_hosted


- Running bot from AWS
  ```$pm2 start npm --name "subgraph-bot-hackathon" -- run "start:prod"```

- AWS API route:
  http://ec2-13-40-62-97.eu-west-2.compute.amazonaws.com:3016/gro_together/all_collectives?subgraph=prod_hosted


Subgraph node
---

- Run node locally:
  - Clean restart (deleting the DB): 
    - ```$sh blockchain_restart.sh```
  - Normal start: 
    - ```docker-compose up```

