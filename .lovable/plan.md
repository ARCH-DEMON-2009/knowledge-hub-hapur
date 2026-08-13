---
name: Attendance Analytics
description: Implementation plan for attendance charts in the admin dashboard.
title: Analytics & Public Pages Plan
---

## Overview
Enhance the Janhitkari Library management system with daily attendance analytics charts and optimized public information pages.

## Proposed Changes

### Admin Dashboard Analytics
- **Recharts Integration**: Install `recharts` to render visual data.
- **Trend Charts**: Add a Line Chart to the Admin "Overview" tab showing:
  - Daily total check-ins.
  - Daily total check-outs.
  - Active occupancy trends over the last 7-30 days.
- **Real-time Occupancy**: Visual gauge for current library capacity/occupancy.

### Public Pages Enhancement
- **Facilities Page**: Detailed breakdown of amenities (Wi-Fi, Computer Lab, Silent Study) with high-quality icons and descriptions.
- **Opening Hours Page**: Clear, responsive schedule display (6 AM - 8 PM daily) with Google Calendar integration pointers.
- **Library Rules Page**: Professional "Code of Conduct" section using a card-based layout for readability.
- **SEO Optimization**: Unique meta titles, descriptions, and JSON-LD for each dedicated page to improve rankings for "Free Library in Hapur".

## Technical Details
- **Charts**: Use `ResponsiveContainer`, `LineChart`, `XAxis`, `YAxis`, `Tooltip`, and `Legend` from `recharts`.
- **Data Flow**: Update the `admin` edge function to return aggregated time-series data for the last 7-14 days.
- **Routing**: Ensure `/facilities`, `/rules`, and a new `/hours` (or integrated into about) are properly linked in the Navbar and Footer.
