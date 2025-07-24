export PATH=/bin
arch=$(/bin/uname -m)
latest=$(/bin/curl https://dl-cdn.alpinelinux.org/alpine/latest-stable/releases/$arch/latest-releases.yaml | /bin/grep "version: [0-9]*.[0-9]*.[0-9]*" | /bin/head -1)
version=${latest:11}
url="https://dl-cdn.alpinelinux.org/alpine/latest-stable/releases/$arch/alpine-minirootfs-$version-$arch.tar.gz"
/bin/curl $url -o alpine.tar.gz
/bin/tar -xvzf alpine.tar.gz
/bin/rm -rf ./alpine.tar.gz
/bin/mkdir ./home/default
/bin/touch boot.sh
echo "cd /home/default;export PATH=/bin /usr/bin;/bin/bash -l"