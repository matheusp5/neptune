class QueueBuilder<T> {
  private queue: T[];

  constructor() {
    this.queue = [];
  }

  enqueue(item: T) {
    this.queue.push(item);
  }

  dequeue(): T | undefined {
    return this.queue.shift();
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}

export default QueueBuilder;
