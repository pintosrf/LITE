echo -e "\033[01;32m\033[01m\nInstalando dependencias..\n\033[0m"
echo -e "\e[36mINSTALANDO GIT..\n\e[0m"
if command -v git >/dev/null 2>&1; then
echo -e "\033[01;33mGit ya estaba instalado anteriormente.\n\033[0m"
else
if pkg install git -y 2>&1 >/dev/null | grep -E -i -q '(command not found|unable to locate package|E: Could not get lock|debconf: delaying package configuration|Package not found|Failed to fetch|404 Not Found|Hash sum mismatch|503 Service Unavailable|504 Gateway Timeout|408 Request Timeout|Connection timed out|Temporary failure resolving)'; then
error=$(pkg install git -y 2>&1 >/dev/null)
echo -e "\033[0;31mError: $error\033[0m"
echo -e "\033[0;34mNo se pudo instalar Git.\033[0m"
exit 1
else
echo -e "\033[01;32m\033[01mGit se ha instalado correctamente.\n\033[0m"
fi
fi
echo -e "\e[36mINSTALANDO NODEJS..\n\e[0m"
if command -v node >/dev/null 2>&1; then
echo -e "\033[01;33mNodejs ya estaba instalado anteriormente.\n\033[0m"
else
if pkg install nodejs -y 2>&1 >/dev/null | grep -E -i -q '(command not found|unable to locate package|E: Could not get lock|debconf: delaying package configuration|Package not found|Failed to fetch|404 Not Found|Hash sum mismatch|503 Service Unavailable|504 Gateway Timeout|408 Request Timeout|Connection timed out|Temporary failure resolving)'; then
error=$(pkg install nodejs -y 2>&1 >/dev/null)
echo -e "\033[0;31mError: $error\033[0m"
echo -e "\033[0;34mNo se pudo instalar Nodejs.\033[0m"
exit 1
else
echo -e "\033[01;32m\033[01mNodejs se ha instalado correctamente.\n\033[0m"
fi
fi
echo -e "\e[36mINSTALANDO FFMPEG..\n\e[0m"
if command -v ffmpeg >/dev/null 2>&1; then
echo -e "\033[01;33mFfmpeg ya estaba instalado anteriormente.\n\033[0m"
else
if pkg install ffmpeg -y 2>&1 >/dev/null | grep -E -i -q '(command not found|unable to locate package|E: Could not get lock|debconf: delaying package configuration|Package not found|Failed to fetch|404 Not Found|Hash sum mismatch|503 Service Unavailable|504 Gateway Timeout|408 Request Timeout|Connection timed out|Temporary failure resolving)'; then
error=$(pkg install ffmpeg -y 2>&1 >/dev/null)
echo -e "\033[0;31mError: $error\033[0m"
echo -e "\033[0;34mNo se pudo instalar FFmpeg.\033[0m"
exit 1
else
echo -e "\033[01;32m\033[01mFFmpeg se ha instalado correctamente.\n\033[0m"
fi
fi
echo -e "\e[36mINSTALANDO IMAGEMAGICK..\n\e[0m"
if command -v convert >/dev/null 2>&1; then
echo -e "\033[01;33mImagemagick ya estaba instalado anteriormente.\n\033[0m"
else
if pkg install imagemagick -y 2>&1 >/dev/null | grep -E -i -q '(command not found|unable to locate package|E: Could not get lock|debconf: delaying package configuration|Package not found|Failed to fetch|404 Not Found|Hash sum mismatch|503 Service Unavailable|504 Gateway Timeout|408 Request Timeout|Connection timed out|Temporary failure resolving)'; then
error=$(pkg install imagemagick -y 2>&1 >/dev/null)
echo -e "\033[0;31mError: $error\033[0m"
echo -e "\033[0;34mNo se pudo instalar ImageMagick.\033[0m"
exit 1
else
echo -e "\033[01;32m\033[01mImageMagick se ha instalado correctamente.\n\033[0m"
fi
fi
echo -e "\e[36mINSTALANDO YARN..\n\e[0m"
if command -v yarn >/dev/null 2>&1; then
echo -e "\033[01;33mYarn ya estaba instalado anteriormente.\n\033[0m"
else
if npm install -g yarn 2>&1 >/dev/null | grep -E -i -q '(command not found|unable to locate package|E: Could not get lock|debconf: delaying package configuration|Package not found|Failed to fetch|404 Not Found|Hash sum mismatch|503 Service Unavailable|504 Gateway Timeout|408 Request Timeout|Connection timed out|Temporary failure resolving)'; then
error=$(npm install -g yarn 2>&1 >/dev/null)
echo -e "\033[0;31mError: $error\033[0m"
echo -e "\033[0;34mNo se pudo instalar Yarn.\033[0m"
exit 1
else
echo -e "\033[01;32m\033[01mYarn se ha instalado correctamente.\n\033[0m"
fi
fi
echo -e "\e[35mCLONANDO REPOSITORIO..\n\e[0m"
echo -e "\033[1;35m"
git clone https://github.com/pintosrf/LITE.git
echo -e "\033[01;32m\033[01mClonación finalizada.\n\033[0m"
cd LITE
echo -e "\e[36mACTUALIZANDO YARN..\n\e[0m"
if yarn install 2>&1 >/dev/null | grep -E -i -q '(command not found|unable to locate package|E: Could not get lock|debconf: delaying package configuration|Package not found|Failed to fetch|404 Not Found|Hash sum mismatch|503 Service Unavailable|504 Gateway Timeout|408 Request Timeout|Connection timed out|Temporary failure resolving)'; then
error=$(yarn install 2>&1 >/dev/null)
echo -e "\033[0;31mError: $error\033[0m"
echo -e "\033[0;34mNo se pudo instalar Yarn.\033[0m"
else
echo -e "\033[01;32m\033[01mYarn se ha actualizado correctamente.\n\033[0m"
fi
echo -e "\e[35mINSTALANDO NPM..\n\e[0m"
if npm install 2>&1 >/dev/null | grep -E -i -q '(command not found|unable to locate package|E: Could not get lock|debconf: delaying package configuration|Package not found|Failed to fetch|404 Not Found|Hash sum mismatch|503 Service Unavailable|504 Gateway Timeout|408 Request Timeout|Connection timed out|Temporary failure resolving)'; then
error=$(npm install 2>&1 >/dev/null)
echo -e "\033[0;31mError: $error\033[0m"
echo -e "\033[0;34mNo se pudo instalar NPM.\033[0m"
else
echo -e "\033[01;32m\033[01mNPM se ha instalado correctamente.\n\033[0m"
fi
clear
echo -e "\033[01;32m\033[01mINICIANDO..\n\033[0m"
sleep 5
npm start