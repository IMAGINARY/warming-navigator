# Station setup

## Hardware

This app is intended to run on a [Raspberry Pi 3B+] paired with a [Waveshare 4.3" 800x480 HDMI display].

Full part list:

- [Raspberry Pi 3B+]
- [Waveshare 4.3" 800x480 HDMI display]
- Micro SD card (> 8GB)
- 5V micro USB power supply
- Rotary encoders (KY-040)
- Cables and adapters (TBD)

[Raspberry Pi 3B+]: https://www.raspberrypi.org/products/raspberry-pi-3-model-b-plus/

[Waveshare 4.3" 800x480 HDMI display]: https://www.waveshare.com/product/raspberry-pi/displays/4.3inch-hdmi-lcd-b.htm

## System configuration

### Preparation of the micro SD card

Flash [Raspberry Pi OS Lite] to the SD card. Open `config.txt` on the `boot` partition and configure the display and the
GPU driver by adding:

```dosini
[all]
hdmi_group=2
hdmi_mode=87
hdmi_cvt=800 480 60
dtoverlay=vc4-kms-v3d
```

Optionally, add the configuration for controlling the exhibit
via [rotary knobs](#emulating-mouse-wheel-navigation-via-gpios).

An internet connection is required for the upcoming steps. Either connect via Ethernet (preferred) or [setup the WiFi].
If you want to SSH into the system, add an empty file called `ssh` to the `boot` partition.

Then, insert the SD card into the Raspberry Pi and boot.

[Raspberry Pi OS Lite]: https://www.raspberrypi.org/software/operating-systems/#raspberry-pi-os-32-bit

[setup the WiFi]: https://www.raspberrypi.org/documentation/configuration/wireless/headless.md

### Package installation

As superuser (`sudo -i`):

```shell
apt update
apt install -y --no-install-recommends \
  chromium-browser \
  git \
  wayland-protocols \
  weston \
  xdotool \
  xwayland \
  ;
```

### App installation and autostart

As superuser (`sudo -i`):

```shell
git clone https://github.com/IMAGINARY/warming-navigator /opt/warming-navigator
cp /opt/warming-navigator/station/*.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable weston python-webserver kiosk
```

As user `pi`:

```shell
mkdir -p /home/pi/.config
cp /opt/warming-navigator/station/weston.ini /home/pi/.config/
```

### Performance options and hardening

To speed up the boot process you might disable waiting for the network on boot via `System Options` → `Network at Boot`
in `sudo raspi-config`.

When you are done with setup and testing, it is recommended to enable the read-only file system via `Performance`
→ `Overlay File System` in `sudo raspi`.

## Input devices

The app can be controlled through arrow keys and mouse wheels/track pads. However, for a physical exhibit, it is more
enjoyable to switch regions and years through rotary knobs as described hereafter.

### Emulating USB keyboard navigation

A quite generic approach is to connect rotary knobs to a microcontroller that emulates a USB HID keyboard. Check
the [`rotenc-navigator`](https://github.com/IMAGINARY/rotenc-navigator) for details.

### Emulating mouse wheel navigation via GPIOs

If your platform supports GPIOs, you can utilize [Linux' `rotary-encoder` driver]. The list of possible options is
provided in the driver's [device tree binding].

For mouse wheel emulation, we need to choose `relative_axis=1` and `linux_axis=6` ([REL_HWHEEL]) for the horizontal
resp. `linux_axis=8` ([REL_WHEEL]) for the vertical direction.

On the Raspberry Pi, this can be configured by adding the following lines to the `config.txt` file on the `boot`
partition:

```dosini
[all]
dtoverlay=rotary-encoder,pin_a=17,pin_b=27,relative_axis=1,linux_axis=6
dtoverlay=rotary-encoder,pin_a=23,pin_b=24,relative_axis=1,linux_axis=8
```

Adjust the values of `pin_a` and `pin_b` to your needs (with respect to the [BCM GPIO pin numbering]). Depending on the
rotary encoder used, you might also need to set appropriate values for `steps-per-period` and `encoding` (see
the [device tree binding]).

[Linux' `rotary-encoder` driver]: https://www.kernel.org/doc/html/latest/input/devices/rotary-encoder.html

[device tree binding]: https://www.kernel.org/doc/Documentation/devicetree/bindings/input/rotary-encoder.txt

[REL_HWHEEL]: https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git/tree/include/uapi/linux/input-event-codes.h?h=linux-5.9.y#n790

[REL_WHEEL]: https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git/tree/include/uapi/linux/input-event-codes.h?h=linux-5.9.y#n792

[BCM GPIO pin numbering]: https://pinout.xyz
