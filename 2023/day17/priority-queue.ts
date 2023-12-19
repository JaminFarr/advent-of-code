export function createPriorityQueue<TItem>() {
  type QueueItem = [number, TItem];
  const queue: Array<QueueItem> = [];

  function dequeue() {
    const [_priority, item] = queue.shift()!;
    return item;
  }

  return {
    enqueue: (item: TItem, priority: number) => {
      const queueItem = [priority, item] satisfies QueueItem;
      const insertIndex = queue.findIndex((item) => item[0] > priority);
      if (insertIndex === -1) {
        queue.push(queueItem);
      } else {
        queue.splice(insertIndex, 0, queueItem);
      }
    },
    dequeue,
    [Symbol.iterator]: function* () {
      while (queue.length) {
        yield dequeue();
      }
    },
  };
}
