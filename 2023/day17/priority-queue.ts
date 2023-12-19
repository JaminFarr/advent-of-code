export function createPriorityQueue<TItem>() {
  type QueueItem = [number, TItem];
  const queue: Array<QueueItem> = [];

  function dequeue() {
    sort();
    const [_priority, item] = queue.shift()!;
    return item;
  }

  let isSorted = true;
  function sort() {
    if (!isSorted) {
      queue.sort((a, b) => a[0] - b[0]);
      isSorted = true;
    }
  }

  return {
    enqueue: (item: TItem, priority: number) => {
      const queueItem = [priority, item] satisfies QueueItem;
      queue.push(queueItem);
      isSorted = false;
    },
    dequeue,
    [Symbol.iterator]: function* () {
      while (queue.length) {
        yield dequeue();
      }
    },
  };
}
