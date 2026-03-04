# Export PBIX metadata

This folder contains a PowerShell script to export metadata (tables, columns, measures, relationships) from a running Power BI Desktop dataset (Tabular model) using ADOMD.NET.

Usage

1. Open the PBIX in Power BI Desktop.
2. Get the local Analysis Services server string (easiest via DAX Studio: connect to the running PBI instance and copy the server, e.g. `localhost:xxxxx`).
3. Run the script from PowerShell:

```powershell
cd backend/scripts
.
\export-pbix-metadata.ps1 -Server "localhost:xxxxx" -Catalog "Model" -OutDir ".\pbix-metadata"
```

Notes
- The script requires the `Microsoft.AnalysisServices.AdomdClient` assembly (ADOMD.NET). If you don't have it installed, follow Microsoft's documentation to install the client libraries: https://learn.microsoft.com/analysis-services/client-libraries/install-adomdnet
- Alternatively use DAX Studio or Tabular Editor to inspect and export model metadata if you prefer a GUI.

If you want, I can also:
- Add a Node.js script that runs DMVs against the local model (requires an XMLA-capable client), or
- Attempt to auto-detect the local PBIDesktop port programmatically.
