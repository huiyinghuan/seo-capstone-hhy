# # Use official Python image
# FROM python:3.13

# # Set the working directory in the container
# WORKDIR /app

# # Copy only requirements.txt first to leverage Docker caching
# COPY requirements.txt .

# # Install dependencies
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy the rest of the project
# COPY . .

# # Expose the Django port
# EXPOSE 8000

# # Set environment variables for Django
# ENV PYTHONUNBUFFERED=1

# # Start Django server
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

#v2
# Use official Python image
FROM python:3.13

# Set the working directory in the container
WORKDIR /app

# Install system dependencies and Node.js
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    make \
    g++ \
    python3-dev \
    wget \
    ca-certificates \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && node -v \
    && npm -v \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set environment variable so chrome-launcher can find Chromivum
ENV CHROME_PATH=/usr/bin/chromium

# Install lighthouse
RUN npm install -g lighthouse

# Verify Node.js and npm are installed
RUN node -v && npm -v

# Copy package.json and install Node packages like lighthouse locally
COPY package.json package-lock.json ./
RUN npm install

# Copy only requirements.txt first to leverage Docker caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt


# Copy the rest of the project
COPY . .

# Expose the Django port
EXPOSE 8000

# Set environment variables for Django
ENV PYTHONUNBUFFERED=1

# Start Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
