# NETRA-RAIL Mobile Development Guidelines

This project is the official role-adaptive mobile companion application for **NETRA-RAIL** (National Enterprise Traffic, Routing & Autonomous Rail-Grid).

## Architectural Guidelines
- **Solid Color Aesthetic**: Strict dark-navy mission-control design system (`#0b1329` base) with solid backgrounds and high contrast typography. No unnecessary visual gradients.
- **Role-Adaptive Layout**: Four role interfaces (Passenger, Freight, Controller, Trackman) driven by centralized telemetry datasets (`Datasets/` directory).
- **Train Motion Animations**: High-speed train animations and live radar pulse indicators across splash and boot loaders.
