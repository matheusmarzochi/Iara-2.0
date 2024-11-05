## How to run this jobs

#### Local
```sh
make worker-bash                            # Access container conected with Local
npx ts-node src/jobs/<job_name>             # Run a DRY RUN mode to verify the process (no write)
DRY_RUN npx ts-node src/jobs/<job_name>     # Apply changes
```

#### Staging
```sh
make -f Makefile.rmt worker-bash            # Access container conected with Staging
npx ts-node src/jobs/<job_name>             # Run a DRY RUN mode to verify the process (no write)
DRY_RUN npx ts-node src/jobs/<job_name>     # Apply changes
```

```sh
make -f Makefile.prd worker-bash            # Access container conected with Production
npx ts-node src/jobs/<job_name>             # Run a DRY RUN mode to verify the process (no write)
DRY_RUN npx ts-node src/jobs/<job_name>     # Apply changes
```
