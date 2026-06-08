/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnatomicalNode, DiagnosticsLog } from "./types";

// Import generated image assets
import cyborgNamaste from "./assets/images/cyborg_namaste_1780920580454.png";
import cyborgNeuralLink from "./assets/images/cyborg_neural_link_1780920595686.png";
import cyborgQuantumCore from "./assets/images/cyborg_quantum_core_1780920610306.png";
import cyborgOpticMatrix from "./assets/images/cyborg_optic_matrix_1780920624853.png";
import cyborgHandActuators from "./assets/images/cyborg_hand_actuators_1780920639850.png";
import cyborgOuterStructure from "./assets/images/cyborg_outer_structure_1780922226234.png";
import cyborgZen1Archon from "./assets/images/cyborg_zen1_archon_1780922255352.png";

export const MAIN_CYBORG_IMAGE = cyborgZen1Archon;
export const ZEN_CYBORG_IMAGE = cyborgNamaste;

export const ANATOMICAL_DATA: AnatomicalNode[] = [
  {
    id: "head",
    title: "Neural Architecture",
    subtitle: "Advanced Intelligence Core",
    tagline: "Quantum-level processing pathways with adaptive neural routing. Decision logic optimized for real-time analysis.",
    x: 50,
    y: 11.5,
    primaryImage: cyborgNeuralLink,
    metrics: {
      syncRate: 98.7,
      temp: 34.2,
      load: 42.1,
      output: "14.8 PetaFLOPS",
    },
    details: [
      {
        label: "Synapse Bridge",
        value: "99.98% Fidelity",
        description: "Enables bi-directional synaptic transmission without somatic lag.",
      },
      {
        label: "Neuro-Lattice State",
        value: "Coherent",
        description: "Active high-dimensional quantum entanglements secured at room temperature.",
      },
    ],
    specifications: [
      {
        category: "Cognitive Processor",
        items: [
          { name: "Architecture", value: "Bio-Quantum Photonic Core" },
          { name: "Thread Capacity", value: "2^24 Parallel Logical Lines" },
          { name: "Latent Storage", value: "3.2 Zettabytes Exa-Memory" },
        ],
      },
      {
        category: "Biometrics",
        items: [
          { name: "Synthetic CSF", value: "Heated Nano-Liquid Gel" },
          { name: "Glia Ratio", value: "12:1 Augmented Density" },
        ],
      },
    ],
    hotspots: [
      {
        id: "synaptic-lattice",
        label: "Luminescence Synaptic Lattice",
        x: 48,
        y: 42,
        description: "Primary neural relay point coordinating conscious intent signals of the biological soul with digital actuators.",
        statLabel: "Bandwidth Speed",
        statValue: "18.4 Tb/s",
        status: "optimal",
      },
      {
        id: "quantum-processor",
        label: "Cerebellar Nano-Processor",
        x: 56,
        y: 65,
        description: "Sits at the base of the skull, accelerating localized quantum math calculations and posture coordination.",
        statLabel: "Clock Speed",
        statValue: "4.8 GHz (Q)",
        status: "overclocked",
      },
      {
        id: "cognitive-bridge",
        label: "Cortical Transceiver Bridge",
        x: 32,
        y: 35,
        description: "External cloud transceiver linking local cybernetic cortex to outer satellite and grid communications recursively.",
        statLabel: "Latency Rate",
        statValue: "0.08 ms",
        status: "optimal",
      },
      {
        id: "cerebellar-bus",
        label: "Biomechanical Spinal Link",
        x: 42,
        y: 78,
        description: "Secures high-density nerve bundle pathways from the spine to the artificial motor matrix, enabling fast reflexes.",
        statLabel: "Channel Load",
        statValue: "14% Active",
        status: "nominal",
      },
    ],
  },
  {
    id: "eyes",
    title: "Cognitive Interface",
    subtitle: "Advanced Sensory System",
    tagline: "Premium faceplate with intelligent eyes and sensory layers. External communications interface with expressional system.",
    x: 50,
    y: 17.5,
    primaryImage: cyborgOpticMatrix,
    metrics: {
      syncRate: 99.4,
      temp: 29.8,
      load: 18.5,
      output: "8K UHD Dynamic",
    },
    details: [
      {
        label: "Aperture Sensitivity",
        value: "f/0.95 Ultra-low",
        description: "Captures individual stray photons in pitch dark conditions with absolute focus.",
      },
      {
        label: "Tactical HUD Mapping",
        value: "Active Refresh",
        description: "Projects environment contours, distance vectors, and structural materials live.",
      },
    ],
    specifications: [
      {
        category: "Iris Sensor",
        items: [
          { name: "Visual Spectrum", value: "200nm to 12000nm (UV to FIR)" },
          { name: "Digital Magnifier", value: "320x Lossless Liquid Lens" },
          { name: "Target Acquisition", value: "0.02ms Response Array" },
        ],
      },
      {
        category: "Protective Layer",
        items: [
          { name: "Optic Guard", value: "Synthetic Sapphire Double-ARC" },
          { name: "Anti-Glare Coil", value: "Polarized Graphene Filament" },
        ],
      },
    ],
    hotspots: [
      {
        id: "photonic-iris",
        label: "Opto-Mechanical Iris",
        x: 50,
        y: 50,
        description: "Precision circular brass blades which open and close seamlessly to coordinate light density. Adapts instantly to changes.",
        statLabel: "Aperture Range",
        statValue: "f/0.95 - f/32",
        status: "optimal",
      },
      {
        id: "targeting-HUD",
        label: "Integrated Targeting Overlay",
        x: 75,
        y: 35,
        description: "Micro-laser projector that overlay digital tactical indicators directly on the peripheral vitreous visual field.",
        statLabel: "Points Scanned",
        statValue: "24,500 pts/s",
        status: "optimal",
      },
      {
        id: "focus-coil",
        label: "Magnetic Magnification Coil",
        x: 28,
        y: 62,
        description: "High-gradient electromagnetic ring that reshapes the liquid lens molecularly to refocus in less than 5 microseconds.",
        statLabel: "Power Draw",
        statValue: "120 mW",
        status: "nominal",
      },
    ],
  },
  {
    id: "core",
    title: "Power Core",
    subtitle: "Energy Distribution System",
    tagline: "Advanced energy source with thermal management. Infinite endurance through quantum power distribution and efficiency optimization.",
    x: 50,
    y: 31.5,
    primaryImage: cyborgQuantumCore,
    metrics: {
      syncRate: 97.2,
      temp: 84.6,
      load: 54.0,
      output: "86.4 GW / hr",
    },
    details: [
      {
        label: "Fuel Efficiency",
        value: "99.998% Yield",
        description: "Advanced deuterium-helium catalysts minimize radiation waste and thermal buildup.",
      },
      {
        label: "Magnetic Shielding",
        value: "95 Tesla Fields",
        description: "Heavy hyper-stable superconducting rings block magnetic leaks from cooking biological parts.",
      },
    ],
    specifications: [
      {
        category: "Engine Core",
        items: [
          { name: "Reactor Mass", value: "4.8 Kilograms Stable" },
          { name: "Catalyst Matrix", value: "Deuterium Liquid Lattice" },
          { name: "Self-Destruct Fail", value: "Triple redundant inert drop-rods" },
        ],
      },
      {
        category: "Thermal Grid",
        items: [
          { name: "Coolant Type", value: "Liquid-Neon Heatsink Pipeline" },
          { name: "Exhaust Outlets", value: "Lateral clavicular nano-valves" },
        ],
      },
    ],
    hotspots: [
      {
        id: "fusion-chamber",
        label: "Magnetic Fusion Ring",
        x: 50,
        y: 50,
        description: "The core combustion vortex containing the swirling plasma, achieving mini-sun ignition states. Superheated and hyper-stable.",
        statLabel: "Core Temperature",
        statValue: "15,000,000 K",
        status: "overclocked",
      },
      {
        id: "electromagnetic-shield",
        label: "Superconducting Magnet Shield",
        x: 50,
        y: 20,
        description: "High-temperature superconductors generating the intense magnetic bottle that keeps plasma floating away from internal walls.",
        statLabel: "Field Intensity",
        statValue: "95.4 Tesla",
        status: "optimal",
      },
      {
        id: "coolant-conduits",
        label: "Liquid Neon Arterial Tubes",
        x: 25,
        y: 65,
        description: "Heavy-duty insulated cryogenic pathways wrapping the reactor, exchanging intense heat for carbon-chassis dissipation.",
        statLabel: "Gallons/Min",
        statValue: "4.2 L/sec",
        status: "nominal",
      },
      {
        id: "distribution-grid",
        label: "Power Distribution Bus",
        x: 75,
        y: 65,
        description: "Routing lines that split gigawatts of electrical discharge into safe millivolt impulses, streaming out to body actuators.",
        statLabel: "Power Coherence",
        statValue: "99.992% Sync",
        status: "optimal",
      },
    ],
  },
  {
    id: "hands",
    title: "Motion System",
    subtitle: "Fluid Kinetic Integration",
    tagline: "Precision engineered joints with mechanical-graphene integration. Smooth dexterous movement with load-handling up to 500kg.",
    x: 36.5,
    y: 55,
    primaryImage: cyborgHandActuators,
    metrics: {
      syncRate: 100.0,
      temp: 26.5,
      load: 5.0,
      output: "Symmetric Lock",
    },
    details: [
      {
        label: "Tactile Haptics",
        value: "0.2 micron Scan",
        description: "Capable of detecting individual cell membranes on organic surfaces via friction sensors.",
      },
      {
        label: "Prayer Equilibrium",
        value: "Perfect Balance",
        description: "Micro-pneumatics maintain symmetric physical posture, facilitating meditation biosignals.",
      },
    ],
    specifications: [
      {
        category: "Actuator Motor",
        items: [
          { name: "Skeletal Frame", value: "Grade 5 Electro-molded Titanium" },
          { name: "Joint Count", value: "34 Interspersed Micro-Servos" },
          { name: "Grip Power", value: "Over 8,500 Newtons of crushing force" },
        ],
      },
      {
        category: "Sensory Matrix",
        items: [
          { name: "Nail-bed Lasers", value: "Laser Distance Gauges (0.1mm accuracy)" },
          { name: "Thermal Touch", value: "Sub-millidegree thermistors" },
        ],
      },
    ],
    hotspots: [
      {
        id: "prayer-plane",
        label: "Symmetry Alignment Zone",
        x: 50,
        y: 50,
        description: "Point where right and left palm interface fields merge, creating a closed cybernetic electromagnetic feedback loop.",
        statLabel: "Balance Drift",
        statValue: "0.000 micrometer",
        status: "optimal",
      },
      {
        id: "flexor-tendons",
        label: "Graphene Nano-Tendons",
        x: 35,
        y: 35,
        description: "Artificially spun black material that contracts and stretches under tiny electrical fields, far stronger than standard steel cable.",
        statLabel: "Tensile Strength",
        statValue: "24.5 GPa",
        status: "optimal",
      },
      {
        id: "nanite-actuator",
        label: "Actuator Micro-Joints",
        x: 65,
        y: 55,
        description: "High-torque joints coated with nano-lubricating spheres to minimize friction wear to mathematically zero levels.",
        statLabel: "Joint Friction",
        statValue: "0.00001 Coeff",
        status: "nominal",
      },
      {
        id: "haptic-mesh",
        label: "Friction Micro-Sensor Mesh",
        x: 45,
        y: 75,
        description: "Piezoelectronic weave layered just below the finger surface sheets, streaming micro-texture raw signals to the brain link.",
        statLabel: "Refresh Frequency",
        statValue: "12,000 Hz",
        status: "optimal",
      },
    ],
  },
  {
    id: "outer",
    title: "Outer Structure",
    subtitle: "Premium Material Shell",
    tagline: "Seamless integration of synthetic skin and metallic plating. Reflective, durable, and engineered for premium aesthetic.",
    x: 42,
    y: 75,
    primaryImage: cyborgOuterStructure,
    metrics: {
      syncRate: 99.1,
      temp: 24.2,
      load: 12.0,
      output: "Graphene Shield Active",
    },
    details: [
      {
        label: "Shield Integrity",
        value: "98.4% Secure",
        description: "Multi-layered dynamic carbon defense provides rigid structural fortification.",
      },
      {
        label: "Dermal Recovery",
        value: "Active Regen",
        description: "Self-healing sub-micron nanite injectors seal surface abrasions autonomously.",
      },
    ],
    specifications: [
      {
        category: "Armor System",
        items: [
          { name: "Core Plating", value: "Interlocking Graphene G3" },
          { name: "Tensile Threshold", value: "140 Gigapascals" },
          { name: "Impact Dispersal", value: "99.4% Across Node Network" },
        ],
      },
      {
        category: "Thermal Venting",
        items: [
          { name: "Micro Porosity", value: "Heated Liquid Gasket Vents" },
          { name: "Vapor Barrier", value: "Active Hydrophobic Spray Coat" },
        ],
      },
    ],
    hotspots: [
      {
        id: "self-healing-armor",
        label: "Self-Healing Nanites",
        x: 50,
        y: 35,
        description: "Embedded sub-micron nanite injectors that actively fuse graphene plates together when compromised.",
        statLabel: "Active Nanites",
        statValue: "2.4 Million",
        status: "optimal",
      },
      {
        id: "reactive-plating",
        label: "Reactive Graphene Plates",
        x: 30,
        y: 60,
        description: "Multi-layered graphene sheets that tense up under electromagnetic pulse fields to disperse physical impact.",
        statLabel: "Armor Rating",
        statValue: "Level 10+",
        status: "optimal",
      },
      {
        id: "thermal-vent-node",
        label: "Dermal Heat Sinks",
        x: 70,
        y: 60,
        description: "Ultra-high conductive mesh that vents excess thermodynamic discharge directly through micro pores.",
        statLabel: "Temp Mitigation",
        statValue: "-42°C drop",
        status: "nominal",
      },
    ],
  },
];

export const INITIAL_DIAGNOSTICS_LOGS: DiagnosticsLog[] = [
  {
    id: "log-1",
    timestamp: "12:08:04",
    source: "SOL-REACTOR V4",
    message: "Helium catalytics optimized. Fusion ignition stable at 15.4M Kelvin.",
    type: "success",
  },
  {
    id: "log-2",
    timestamp: "12:08:15",
    source: "CORTEX NX-9",
    message: "Quantum neural-lattice synchronization complete with standard server mesh.",
    type: "info",
  },
  {
    id: "log-3",
    timestamp: "12:08:28",
    source: "OPTIC SENSOR",
    message: "Automatic shutter sequence executed. Dynamic infrared exposure normalized.",
    type: "info",
  },
  {
    id: "log-4",
    timestamp: "12:08:42",
    source: "NAMASTE SYSTEM",
    message: "Perfect balance feedback loop lock achieved. Drift error rate < 0.00001%.",
    type: "success",
  },
  {
    id: "log-5",
    timestamp: "12:08:50",
    source: "MONITOR CELL",
    message: "Ambient terminal diagnostics initialized. All subsystems report nominal behavior.",
    type: "info",
  },
];
