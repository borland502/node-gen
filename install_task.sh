#!/usr/bin/env bash

if [[ $(command -v task) ]]; then
  echo "Taskfile is already installed."; exit 0
fi

# homebrew is available for both linux (and thus windows wsl) and macos.  It also has the benefit of
# having the same package name and command across each environment.  The penalty is extra disk space
# required for all the userspace / system command overrides
if [[ $(command -v brew) ]]; then
  brew install go-task/tap/go-task
  brew install go-task; exit 0
fi

# https://stackoverflow.com/questions/394230/how-to-detect-the-os-from-a-bash-script
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  DISTRO_FAMILY=$(sed -n 's/^ID_LIKE="\([^"]*\)"$/\1/p' /etc/os-release)

  if [[ "${DISTRO_FAMILY}" == "arch" ]];then
    sudo pacman -S go-task --noconfirm; exit 0
  elif [[ "${DISTRO_FAMILY}" == "debian" ]]; then
    sudo apt install go-task -y; exit 0
  elif [[ "${DISTRO_FAMILY}" == "redhat" ]]; then
    sudo dnf install go-task; exit 0
  else
    echo "Distro family ${DISTRO_FAMILY} not recognized.  Attempting script install"
  fi
else
    echo "Unknown OS ${OSTYPE}.  Attempting script install"
fi

# Fallback to vendor generic script install
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d