#!/bin/bash
#until psql -h htest -upostgres -ppostgres -e'select 1'; do echo "still waiting for mysql"; sleep 1; done

exec npm run db-migrate;
exec npm run db-seed-all;
#exec npm run prod;
