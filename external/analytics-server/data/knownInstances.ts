type KnownInstanceObject = {
  name: string;
  direct: string[];
  match: (string | RegExp)[];
};

export const knownInstances: KnownInstanceObject[] = [
  {
    name: 'stoat.chat',
    direct: ['api.stoat.chat/0.8'],
    match: ['revolt.chat', 'stoat.chat'],
  },
];
