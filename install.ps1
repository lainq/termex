$NPM_MODULES = $HOME + "\AppData\Roaming\npm\"

function Write-Color([String[]]$Text, [ConsoleColor[]]$ForeGroundColor, [ConsoleColor[]]$BackGroundColor) {
    for ($i = 0; $i -lt $Text.Length; $i++) {
        $Color = @{}
        if ($ForeGroundColor -and $BackGroundColor){
            $Color = @{
                ForegroundColor = $ForeGroundColor[$i%($ForeGroundColor.count)]
                BackgroundColor = $BackGroundColor[$i%($BackGroundColor.count)]
            }
        } elseif ($ForeGroundColor) {
            $Color = @{
                ForegroundColor = $ForeGroundColor[$i%($ForeGroundColor.count)]
            }
        } elseif ($BackGroundColor) {
            $Color = @{
                BackgroundColor = $BackGroundColor[$i%($BackGroundColor.count)]
            }
        }
        Write-Host $Text[$i] @color -NoNewLine
    }
    Write-Host
}

function check_for_termex {
    $termex_path = $NPM_MODULES + "termex"
    $exists = [System.IO.File]::Exists($termex_path)
    if($exists -eq $False){
        Write-Color "Installing Termex...".PadRight(50), '[', '   OK   ', ']' -fore cyan, White, green, white
        npm i termex -g
    }
    Write-Color "Installed Termex...".PadRight(50), '[', 'OK', ']' -fore cyan, White, green, white
    Write-Color "Looking for Termex RPC file...".PadRight(50), '[', 'SEARCHING', ']' -fore cyan, White, yellow, white
    if([System.IO.File]::Exists($HOME + "\.termex\.rpc") -eq $False){
        Write-Color "Failed to find rpc file...".PadRight(50), '[', 'FAILED', ']' -fore cyan, White, red, white
        $enable = Read-Host "Enable Discord RPC [y/n]?"
        if($enable -eq "y"){
            Write-Color "Opening termex...".PadRight(50), '[', 'INITIALIZING', ']' -fore cyan, White, yellow, white
            termex rpc --enable
        }
    } else {
        Write-Color "Found RPC file...".PadRight(50), '[', 'SUCCESS', ']' -fore cyan, White, green, white
    }
}

check_for_termex 
