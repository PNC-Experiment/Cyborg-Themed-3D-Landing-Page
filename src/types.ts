/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StatusType = "optimal" | "nominal" | "warning" | "overclocked";

export interface SubsystemHotspot {
  id: string;
  label: string;
  x: number; // percentage (0 - 100) on detailed subsystem image
  y: number; // percentage (0 - 100) on detailed subsystem image
  description: string;
  statLabel: string;
  statValue: string;
  status: StatusType;
}

export interface SubsystemMetrics {
  syncRate: number; // percentage (0 - 100)
  temp: number; // celsius
  load: number; // percentage (0 - 100)
  output: string; // text (e.g., "5.4 GW")
}

export interface AnatomicalNode {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  x: number; // percentage coordinate on main body diagram
  y: number; // percentage coordinate on main body diagram
  primaryImage: string; // The generated 3D visual path
  metrics: SubsystemMetrics;
  details: {
    label: string;
    value: string;
    description: string;
  }[];
  specifications: {
    category: string;
    items: { name: string; value: string }[];
  }[];
  hotspots: SubsystemHotspot[];
}

export interface DiagnosticsLog {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: "info" | "success" | "warn" | "critical";
}
