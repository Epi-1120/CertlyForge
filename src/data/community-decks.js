export const communityDecks = [
  { id: 'deck_cisa', name: 'CISA Key Terms', cert: 'CISA', color: '#0D9488', cards: [
    { front: 'Full vs Incremental vs Differential backup', back: 'Full = everything\nIncremental = since last any backup\nDifferential = since last full' },
    { front: 'SDLC phases', back: 'Feasibility > Requirements > Design > Dev > Test > Implement > Maintain' },
    { front: 'Segregation of duties', back: 'No one person has authorization + execution + custody + recording' },
    { front: 'Access control models', back: 'DAC = owner decides\nMAC = system enforces\nRBAC = role-based' }
  ]},
  { id: 'deck_sec', name: 'Security+ Confused Concepts', cert: 'Security+', color: '#DC2626', cards: [
    { front: 'IDS vs IPS', back: 'IDS = detect + alert (passive)\nIPS = detect + block (inline)' },
    { front: 'Vuln vs Threat vs Risk', back: 'Vuln = weakness\nThreat = exploits weakness\nRisk = likelihood x impact' },
    { front: 'Hash vs Encrypt', back: 'Hash = one-way (integrity)\nEncrypt = two-way (confidentiality)' }
  ]},
  { id: 'deck_ccna', name: 'CCNA OSI Layers', cert: 'CCNA', color: '#0284C7', cards: [
    { front: 'Layer 1 Physical', back: 'Cables, hubs. Bits.' },
    { front: 'Layer 2 Data Link', back: 'Switches. MAC addresses. Frames.' },
    { front: 'Layer 3 Network', back: 'Routers. IP addresses. Packets.' },
    { front: 'Layer 4 Transport', back: 'TCP/UDP. Ports. Segments.' },
    { front: 'Memory trick', back: 'Please Do Not Throw Sausage Pizza Away' }
  ]}
]
