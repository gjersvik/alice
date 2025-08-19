FROM ollama/ollama

# Ensure the directory exists and is owned by ubuntu
RUN mkdir -p /home/ubuntu/.ollama && chown ubuntu:ubuntu /home/ubuntu/.ollama

# Switch to the non-root user
USER ubuntu

VOLUME [ "/home/ubuntu/.ollama/" ]
