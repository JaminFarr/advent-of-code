import { splitByLine } from "@utils";
import lcm from "compute-lcm";
import invariant from "tiny-invariant";

enum ModuleType {
  FlipFlop,
  Conjunction,
  Broadcast,
}

enum PulseType {
  Low,
  High,
}

const modulePulseHandler: Record<
  ModuleType,
  (
    module: Module,
    pulse: PulseType,
    from: Module,
    send: (from: Module, to: string, pulse: PulseType) => void
  ) => void
> = {
  [ModuleType.FlipFlop](module, pulse, from, send) {
    if (pulse === PulseType.High) return;
    module.state["output"] =
      module.state["output"] === PulseType.High
        ? PulseType.Low
        : PulseType.High;

    module.to.forEach((target) => send(module, target, module.state["output"]));
  },

  [ModuleType.Conjunction](module, pulse, from, send) {
    module.state[from.name] = pulse;
    const output = Object.values(module.state).every(
      (value) => value === PulseType.High
    )
      ? PulseType.Low
      : PulseType.High;
    module.to.forEach((target) => send(module, target, output));
  },

  [ModuleType.Broadcast](module, pulse, _from, send) {
    module.to.forEach((target) => send(module, target, pulse));
  },
};
type Module = ReturnType<typeof parseModule>;

function parseModule(moduleString: string) {
  let [name, toList] = moduleString.split(" -> ");

  let type = ModuleType.Broadcast;
  if (name.startsWith("%")) {
    type = ModuleType.FlipFlop;
    name = name.slice(1);
  } else if (name.startsWith("&")) {
    type = ModuleType.Conjunction;
    name = name.slice(1);
  }

  const to = toList.split(", ");

  return {
    type,
    name,
    to,
    pulseHandler: modulePulseHandler[type],
    state: {} as Record<string, PulseType>,
  };
}

const EMPTY_MODULE = parseModule("nowhere -> nowhere");

function setInitialStates(modules: Module[]) {
  for (const module of modules) {
    switch (module.type) {
      case ModuleType.FlipFlop:
        module.state["output"] = PulseType.Low;
        break;
      case ModuleType.Conjunction:
        const inputs = modules.filter((m) => m.to.includes(module.name));
        for (const input of inputs) {
          module.state[input.name] = PulseType.Low;
        }
        break;
      case ModuleType.Broadcast:
        break;
    }
  }
}

function sendPulse(
  moduleMap: Map<string, Module>,
  name: string,
  pulse: PulseType,
  onPulse: (to: string, from: Module, pulse: PulseType) => void
) {
  const pulseQueue: [to: string, from: Module, pulse: PulseType][] = [];

  function send(from: Module, to: string, pulse: PulseType) {
    pulseQueue.push([to, from, pulse]);
  }

  send(EMPTY_MODULE, name, pulse);

  while (pulseQueue.length > 0) {
    const [to, from, pulse] = pulseQueue.shift()!;
    onPulse?.(to, from, pulse);
    const toModule = moduleMap.get(to);
    if (!toModule) {
      continue;
    }

    toModule.pulseHandler(toModule, pulse, from, send);
  }
}

function parseInput(input: string) {
  const modules = splitByLine(input).map(parseModule);

  const modulesMap = new Map<string, Module>(
    modules.map((module) => [module.name, module])
  );

  return { modules, modulesMap };
}

export function processPart1(input: string): number {
  const { modules, modulesMap } = parseInput(input);

  setInitialStates(modules);

  let pulseCounts = {
    [PulseType.Low]: 0,
    [PulseType.High]: 0,
  };

  function onPulse(to: string, from: Module, pulse: PulseType) {
    pulseCounts[pulse]++;
  }

  for (let i = 0; i < 1000; i++) {
    sendPulse(modulesMap, "broadcaster", PulseType.Low, onPulse);
  }

  return pulseCounts[PulseType.High] * pulseCounts[PulseType.Low];
}

function analyseModules(modulesMap: Map<string, Module>, targetName: string) {
  const sourceMap = new Map<string, Module[]>();

  for (const [_name, module] of modulesMap) {
    for (const target of module.to) {
      if (!sourceMap.has(target)) {
        sourceMap.set(target, []);
      }
      sourceMap.get(target)?.push(module);
    }
  }

  const stack = [targetName];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const name = stack.shift()!;

    if (visited.has(name)) {
      continue;
    }

    visited.add(name);

    console.log(
      (sourceMap
        .get(name)
        ?.map((m) => m.type + m.name)
        .join(", ") || "") +
        " -> " +
        name
    );

    for (const source of sourceMap.get(name) || []) {
      stack.push(source.name);
    }
  }

  console.log(visited.size);
}

export function processPart2(input: string): number {
  const { modules, modulesMap } = parseInput(input);
  setInitialStates(modules);
  // analyseModules(modulesMap, "rx");

  let buttonPushCount = 0;

  // Analysing the module graph, we can see that there is a cycle for the 4
  // modules that are connected to "lv" connected to the goal "rx"
  const monitor = ["st", "tn", "hh", "dt"];
  const cycleSizeMap = new Map<string, number>();

  function onPulse(to: string, from: Module, pulse: PulseType) {
    // if (to === "rx" && pulse === PulseType.Low) {
    //   isSandMachineStarted = true;
    // }

    if (
      monitor.includes(from.name) &&
      pulse === PulseType.High &&
      !cycleSizeMap.has(from.name)
    ) {
      cycleSizeMap.set(from.name, buttonPushCount);
    }
  }

  while (cycleSizeMap.size !== monitor.length) {
    buttonPushCount++;
    sendPulse(modulesMap, "broadcaster", PulseType.Low, onPulse);
  }

  return lcm([...cycleSizeMap.values()])!;
}
