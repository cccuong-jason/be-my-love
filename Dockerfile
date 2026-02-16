FROM oven/bun:1

WORKDIR /app

# Path for next and other binaries
ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies first
COPY package.json bun.lockb* ./
RUN bun install

# Copy everything else
COPY . .

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
ENV NODE_ENV=development

EXPOSE 3000

# Use bun run dev directly
CMD ["bun", "run", "dev"]
