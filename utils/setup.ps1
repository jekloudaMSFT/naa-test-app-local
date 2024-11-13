Push-Location $PSScriptRoot

# Get the ID and security principal of the current user account
$myWindowsID = [System.Security.Principal.WindowsIdentity]::GetCurrent()
$myWindowsPrincipal = new-object System.Security.Principal.WindowsPrincipal($myWindowsID)

# Get the security principal for the Administrator role
$adminRole = [System.Security.Principal.WindowsBuiltInRole]::Administrator

Write-Host -ForegroundColor Yellow "`nChecking $Env:windir\System32\drivers\etc\hosts...";
set-variable -name HostsLocation -value "$Env:windir\System32\drivers\etc\hosts"
set-variable -name NewHostEntry  -value "127.0.0.1 local.teams.office.com"

# Check for the entry in the hosts file
if ((Get-Content $HostsLocation -raw) -match (".*$NewHostEntry.*" -replace " ", "\s+")) {
   Write-Host -ForegroundColor Green "The hosts file already contains the entry: $NewHostEntry. Skipping update!";
}
else {
   # Check to see if we are currently running "as Administrator"
   if ($myWindowsPrincipal.IsInRole($adminRole)) {
      # We are running "as Administrator" - so change the title and background color to indicate this
      $Host.UI.RawUI.WindowTitle = $myInvocation.MyCommand.Definition + "(Elevated)"
      clear-host
   }
   else {
      # We are not running "as Administrator" - so relaunch as administrator
      Write-Host -ForegroundColor Yellow "`nAdmin permissions are required. Attempting to elevate..."

      # Create a new process object that starts PowerShell
      $newProcess = new-object System.Diagnostics.ProcessStartInfo "PowerShell";

      # Specify the current script path and name as a parameter
      $newProcess.Arguments = "-ExecutionPolicy ByPass " + $myInvocation.MyCommand.Definition ;

      # Indicate that the process should be elevated
      $newProcess.Verb = "runas";

      # Start the new process
      [System.Diagnostics.Process]::Start($newProcess);

      # Exit from the current, unelevated, process
      exit
   }

   try {
      # Fix hosts file
      Write-Host -ForegroundColor Green "The hosts file does not contain the entry: $NewHostEntry. Updating...";
      Add-Content -Path $HostsLocation -Value "`n$NewHostEntry";
   }
   catch {
      Write-Host "An error occurred:"
      Write-Host $_
   }
}

Pop-Location
