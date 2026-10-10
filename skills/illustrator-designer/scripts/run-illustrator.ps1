param(
    [Parameter(Mandatory = $true)][string]$JsxPath,
    [switch]$Launch
)

$ErrorActionPreference = 'Stop'
$illustratorApp = $null
try {
    $resolvedJsx = (Resolve-Path -LiteralPath $JsxPath -ErrorAction Stop).ProviderPath
    if (-not (Test-Path -LiteralPath $resolvedJsx -PathType Leaf) -or
        [IO.Path]::GetExtension($resolvedJsx) -ne '.jsx') {
        throw 'JsxPath must identify an existing .jsx file.'
    }
    try {
        $illustratorApp = [Runtime.InteropServices.Marshal]::GetActiveObject('Illustrator.Application')
    } catch {
        if (-not $Launch) {
            throw 'Illustrator is not available. Open it, or use -Launch for an authorized design task.'
        }
        $illustratorApp = New-Object -ComObject Illustrator.Application
    }

    # A UTF-8 file avoids shell interpolation of user text and JSX source.
    $scriptFile = New-Object System.IO.FileInfo($resolvedJsx)
    $safeJsxPath = $scriptFile.FullName.Replace('\', '/').Replace('"', '\"')
    $evalSource = '(function(){try {var f=new File("' + $safeJsxPath + '");f.encoding="UTF-8";if(!f.open("r"))throw new Error("Cannot open JSX");var s=f.read();f.close();var r=eval(s);return "ILLUSTRATOR_OK:"+String(r);}catch(e){return "ILLUSTRATOR_ERROR:"+e.toString()+" (line "+e.line+")";}})()'
    $resultText = [string]$illustratorApp.DoJavaScript($evalSource)
    if ($resultText.StartsWith('ILLUSTRATOR_ERROR:')) {
        throw $resultText.Substring('ILLUSTRATOR_ERROR:'.Length)
    }
    if (-not $resultText.StartsWith('ILLUSTRATOR_OK:')) {
        throw 'Illustrator returned no recognized execution result; inspect before retrying.'
    }
    Write-Output $resultText.Substring('ILLUSTRATOR_OK:'.Length)
} catch {
    [Console]::Error.WriteLine($_.Exception.Message)
    exit 1
} finally {
    if ($null -ne $illustratorApp -and [Runtime.InteropServices.Marshal]::IsComObject($illustratorApp)) {
        [void][Runtime.InteropServices.Marshal]::ReleaseComObject($illustratorApp)
    }
}
