FROM surrealdb/surrealdb:latest-dev

# Create the data directory and set permissions for the surrealdb user (usually UID 1000, check the image docs)
RUN mkdir -p /mydata && \
    chown -R 1000:1000 /mydata

USER 1000:1000

VOLUME ["/mydata"]

CMD ["start", "--user", "admin", "--pass", "playwithdata", "rocksdb:/mydata/mydatabase.db"]