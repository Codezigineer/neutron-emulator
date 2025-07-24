export PATH=/bin
arch=$(/bin/uname -m)
latest=$(/bin/curl https://dl-cdn.alpinelinux.org/alpine/latest-stable/releases/$arch/latest-releases.yaml | /bin/grep "version: \\d*.\\d*.\\d*" | /bin/head -1)
version=${latest:11}
url="https://dl-cdn.alpinelinux.org/alpine/latest-stable/releases/$arch/alpine-minirootfs-$version-$arch.tar.gz"
/bin/curl $url -o alpine.tar.gz
/bin/tar -xvzf alpine.tar.gz
/bin/mv  -v ./alpine/.[!.]* ./
/bin/rm -rf ./alpine