#!/bin/bash

DATA_DIR=/home/yugabyte/yb_data

echo "Start yugabyte with DATA_DIR=$DATA_DIR"

# Collect info
HOSTNAME=chat-yugabyte
echo SETUP HOST IP: $(hostname -I) HOST NAME iS: ${HOSTNAME}

# Update local cache
echo "${HOSTNAME}" >> /etc/hosts
# Split and update /etc/hosts
IFS=',' read -ra hosts <<< "${YUGABYTE_MASTER_HOSTS:-6521c0908453}"
for host in "${hosts[@]}"; do
  echo "$(hostname -I) ${host}" >> /etc/hosts
done

# Start node
bin/yugabyted-ui -bind_address 0.0.0.0 &
# sleep 1
bin/yugabyted start --base_dir=${DATA_DIR} --background=true --ui=false --advertise_address=${HOSTNAME}

# Check for cluster state
bin/yb-admin \
    --master_addresses ${HOSTNAME}:7100 \
    master_leader_stepdown
bin/yb-admin --master_addresses ${HOSTNAME}:7100 get_universe_config &

# echo Restore from /tmp/dump-2025-06-09.sql
# # Process file
# sed -i 's/LOCALE_PROVIDER = libc //g' /tmp/dump-2025-06-09.sql
# sed -i '/default_table_access_method/d' /tmp/dump-2025-06-09.sql
# sed -i '/ALTER SEQUENCE public\.chat_users_features_id_seq OWNED BY public.chat_users_features.id;/i \
# CREATE EXTENSION pgcrypto SCHEMA public;' /tmp/dump-2025-06-09.sql
# sed -i 's/gen_random_uuid/public\.gen_random_uuid/g' /tmp/dump-2025-06-09.sql
# sleep 60
# # Restore database from backup
# bin/ysqlsh -h yugabyte < /tmp/dump-2025-06-09.sql
# # <== end restore line

tail -F \
  --retry \
  "${DATA_DIR}/logs/yugabyted.log" \
  "${DATA_DIR}/logs/master.out" \
  "${DATA_DIR}/logs/master.err" \
  "${DATA_DIR}/logs/master/yb-master.INFO" \
  "${DATA_DIR}/logs/master/yb-master.WARNING" \
  "${DATA_DIR}/logs/master/yb-master.FATAL" \
  "${DATA_DIR}/logs/tserver.out" \
  "${DATA_DIR}/logs/tserver.err" \
  "${DATA_DIR}/logs/tserver/yb-tserver.INFO" \
  "${DATA_DIR}/logs/tserver/yb-tserver.WARNING" \
  "${DATA_DIR}/logs/tserver/yb-tserver.FATAL" \
  "${DATA_DIR}/logs/tserver/postgres*.log"
