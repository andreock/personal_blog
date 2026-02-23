import"./DsnmJJEf.js";import"./CdHX1ZD5.js";import{f as g,s as a,a as v,b as w,d as e,g as s,aS as _}from"./JczOs3xW.js";import{h as n}from"./biV2n0MW.js";import{l as b,s as E}from"./CTt6hDyY.js";import{B as S}from"./Blrigb42.js";const l={layout:"blog_article",title:"DIY Smart home",author:"Andrea Canale",description:"Create your own smart home using ESP32-C3, ESPHome and Home Assistant",thumbnail:"/esphome.svg"},{layout:B,title:V,author:x,description:Y,thumbnail:F}=l;var P=g('<h2>The reasons for a DIY smart home</h2> <p>In recent years, the concept of a smart home has become increasingly popular, offering convenience, security, and energy efficiency. However, many commercial smart home solutions, like valve for heaters, can be expensive, furthermore there are privacy/security concerns with proprietary systems especially when buying devices from cheap vendor. This is where DIY smart home projects come in, allowing individuals to create their own customized smart home systems using affordable components and open-source software.</p> <h2>What we are going to build</h2> <p>In this article we will see how to create two components for my smart home using ESPHome, I assume that you already have a Home Assistant setup, if not I suggest you to check the official documentation of Home Assistant before proceeding. The two components we will create are:</p> <ul><li>A smart valve for the heaters, using an ESP32-C3 and a cheap thermal actuator.</li> <li>A temperature and humidity sensor, using an ESP32-C3 and a DHT22 sensor. I also have added a BMP180 sensor to measure the atmospheric pressure, but it is not strictly necessary for the project.</li></ul> <p>Other devices like smart plugs or similar require connection to 110/220V and a high level of skill in electronics to make them secure, so I will not cover them in this article besides I have implemented them as a test but not using it in my setup as a security precaution(<strong>usually cheap board for AC like relay or voltmeter are unsafe and have serious safety issues so avoid them if you care about your home and your life</strong>). However, ESPHome is really easy to use and you can create your own custom devices with it, so feel free to experiment and create your own smart home components.</p> <p><strong>I AM NOT RESPONSIBLE FOR ANY DAMAGE TO PEOPLE OR PROPERTY. THIS ARTICLE IS FOR INFORMATIONAL PURPOSES ONLY. IF YOU WANT TO BUILD CUSTOM DEVICES, PLEASE MAKE SURE YOU HAVE THE APPROPRIATE EXPERIENCE AND USE EXTREME CAUTION.</strong></p> <h2>Temperature and humidity sensor</h2> <p>Since we need to measure the temperature and humidity in the rooms to regulate our heaters, we will start with the temperature and humidity sensor. For this component, we will use an ESP32-C3 microcontroller and a DHT22 sensor. The DHT22 is a popular and cheap sensor for measuring temperature and humidity with a decent accuracy, and it is easy to use with the ESP32-C3. For the maximum accuracy use BMP sensor series like BMP180 or BMP280, they are more expensive but they are more accurate and they can also measure the atmospheric pressure.</p> <p>For the hardware, you will need:</p> <ul><li>An ESP32 board (I use the ESP32-C3 Supermini but ESPHome supports a wide range of ESP32 boards, so you can choose the one that best suits your needs and budget).</li> <li>A DHT22 sensor (or a BMP180 sensor if you want to measure atmospheric pressure).</li> <li>3 Wires to connect the sensor to the ESP32.</li></ul> <p>The wiring is pretty simple, you just need to connect the VCC and GND pins of the sensor to the 3.3V and GND pins of the ESP32, and the data pin of the sensor to a GPIO pin of the ESP32 (for example GPIO3).</p> <p>Here my configuration for the ESPHome:</p> <pre class="language-yaml"><!></pre> <p>The deep sleep component is optional but it is useful to save battery if you are using a battery powered ESP32. You can buy and ESP32 with a battery connector and a IC to manage battery or you can use a power bank.</p> <p>You can flash it using the ESPHome CLI, just run the following command in the terminal:</p> <pre class="language-bash"><!></pre> <h2>Smart valve for heaters</h2> <p>For the smart valve, we will use an ESP32-C3 microcontroller and a cheap thermal actuator. The thermal actuator is a type of valve that can be controlled electronically, allowing us to open and close the valve to regulate the flow of water to the heaters. This type of valve is not modulating, it is either open or closed, this can be a limitation if you want to have a more precise control of the temperature, but it is a good compromise between cost and functionality.</p> <p>Check also for the valve thread, typically for heaters you will need a M30x1.5 but check the specifications of your heaters before buying the valve.</p> <p>For the hardware, you will need:</p> <ul><li>An ESP32 board (I use the ESP32-C3 Supermini but ESPHome supports a wide range of ESP32 boards, so you can choose the one that best suits your needs and budget).</li> <li>A thermal actuator (you can find cheap ones on Amazon or Aliexpress, just make sure to check the specifications and the compatibility with your heaters). <a href="https://it.aliexpress.com/item/1005007902803077.html" rel="nofollow">This is the valve that I bought</a> for around 10€. Buy a 24V DC version, this will be much safer than the 220V AC version.</li> <li>A 24V 1A DC power supply.</li> <li>A MOSFET to control the power to the valve. (Or a relay module but it will be noisy)</li> <li>24V to 5V step down converter to power the ESP32 from the same power supply of the valve.</li> <li>A DC jack to connect the power supply to the circuit.</li> <li>A 1N5824 diode to protect the circuit from the back EMF generated by the valve when it is turned off.</li> <li>A 220 ohm resistor to limit the current to the MOSFET.</li></ul> <p>The last two components are needed only if you are using a MOSFET instead of a relay module.</p> <p><strong>The 24V thermal actuators will need a 24V power supply so this solution assume that you have a 24V power supply available near the heaters.</strong></p> <p>The wiring is the following if you use a MOSFET:</p> <p><img src="Schematic_Valve_2026-02-22.png" alt="Solenoid valve electric scheme"/></p> <ul><li>The diode is connected in parallel to the valve, with the cathode connected to the positive terminal of the valve and the anode connected to the negative terminal of the valve. This will protect the circuit from the back EMF generated by the valve when it is turned off.</li> <li>The resistor is connected in series with the gate of the MOSFET, this will limit the current to the gate and protect the ESP32 from damage.</li></ul> <p>I also made a PCB to make the wiring easier and more secure.</p> <p><img src="valve_pcb.png" alt="Solenoid valve PCB photo"/></p> <p>You can download the PCB gerber files from <a href="Gerber_Valvola_PCB_Valve_2026-02-22.zip">this link</a>. The buck converter of the PCB is the following: <a href="https://it.aliexpress.com/item/1005009570264704.html" rel="nofollow">24V to 5V step down converter</a> for around 2€.</p> <p>Here my configuration for the ESPHome:</p> <pre class="language-yaml"><!></pre> <p>This configuration works if the thermal actuator is normally closed, if you have a normally open valve you need to set <code>inverted: true</code> in the switch component to allow the switch to be consistent with the actuator state.</p> <p>The deep sleep is configurable from Home Assistant if you want to use it.</p> <p>You can flash it using the ESPHome CLI, just run the following command in the terminal:</p> <pre class="language-bash"><!></pre> <h2>The Home Assistant integration</h2> <p>Once you have flashed the ESP32 with the ESPHome configuration, you can add the devices to Home Assistant. you can find them in the device panel under the settings page.</p> <p>Once you have added the devices to Home Assistant, you can create the termostat using the generic thermostat helper, you can find the documentation <a href="https://www.home-assistant.io/integrations/generic_thermostat/" rel="nofollow">here</a>. The generic thermostat allows you to create a thermostat using a temperature sensor and a switch to control the heating.  You can create it under the Helpers tab in the device page. You can also create automations to regulate the temperature based on the time of the day or other conditions.</p> <p>You can also create a dashboard to control the devices and monitor the temperature and humidity in the rooms. Home Assistant has a powerful dashboard editor that allows you to create custom dashboards with different types of cards and widgets. If you also have other smart home devices(not only with ESPHome), you can integrate them(if supported) into the same dashboard to have a centralized control of your smart home.</p> <p>When you will have configured the thermostat and the device, you will have something like this when you click on the device card of the valve:</p> <p><img src="final_result_ha.png" alt="Device Home Assistant valve card"/></p> <h2>Conclusion</h2> <p>In this article we have seen how to create two components for a DIY smart home using ESPHome, a temperature and humidity sensor and a smart valve for heaters. These components are just examples of what you can create with ESPHome, the possibilities are endless and you can create your own custom devices to suit your needs and budget. DIY smart home projects can be a fun and rewarding way to create a personalized smart home system, and they can also save you money compared to commercial solutions furthermore they are more privacy-preserving than commercial solutions.</p>',1);function A(i,u){const k=b(u,["children","$$slots","$$events","$$legacy"]);S(i,E(()=>k,()=>l,{children:(h,T)=>{var r=P(),t=a(v(r),26),m=e(t);n(m,()=>`<code class="language-yaml"><span class="token key atrule">esphome</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> my<span class="token punctuation">-</span>sensor
<span class="token key atrule">esp32</span><span class="token punctuation">:</span>
  <span class="token key atrule">board</span><span class="token punctuation">:</span> lolin_c3_mini <span class="token comment"># Change this to your board</span>
  <span class="token key atrule">framework</span><span class="token punctuation">:</span>
    <span class="token key atrule">type</span><span class="token punctuation">:</span> esp<span class="token punctuation">-</span>idf

<span class="token comment"># Enable serial/api logging</span>
<span class="token key atrule">logger</span><span class="token punctuation">:</span>

<span class="token comment"># Enable Home Assistant API</span>
<span class="token key atrule">api</span><span class="token punctuation">:</span>

<span class="token key atrule">ota</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">platform</span><span class="token punctuation">:</span> esphome
    <span class="token key atrule">password</span><span class="token punctuation">:</span> <span class="token string">""</span>

<span class="token key atrule">wifi</span><span class="token punctuation">:</span>
  <span class="token key atrule">ssid</span><span class="token punctuation">:</span> <span class="token string">"my-ssid"</span>
  <span class="token key atrule">password</span><span class="token punctuation">:</span> <span class="token string">"your-secret-password"</span>
  <span class="token key atrule">output_power</span><span class="token punctuation">:</span> 8.5dB <span class="token comment"># If you use ESP32-C3 supermini you need to reduce the output power to avoid overheating issues and interference with the stock antenna</span>

<span class="token key atrule">sensor</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">platform</span><span class="token punctuation">:</span> dht
    <span class="token key atrule">pin</span><span class="token punctuation">:</span> <span class="token number">3</span>
    <span class="token key atrule">temperature</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">"Temperature"</span>
    <span class="token key atrule">humidity</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">"Humidity"</span>
    <span class="token key atrule">model</span><span class="token punctuation">:</span> DHT22
    <span class="token key atrule">update_interval</span><span class="token punctuation">:</span> 60s

<span class="token key atrule">deep_sleep</span><span class="token punctuation">:</span>
  <span class="token key atrule">id</span><span class="token punctuation">:</span> deep_sleep_1
  <span class="token key atrule">run_duration</span><span class="token punctuation">:</span> 1min
  <span class="token key atrule">sleep_duration</span><span class="token punctuation">:</span> 15min

<span class="token key atrule">switch</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">platform</span><span class="token punctuation">:</span> template
    <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">"OTA Mode"</span>
    <span class="token key atrule">turn_on_action</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">deep_sleep.prevent</span><span class="token punctuation">:</span> deep_sleep_1
    <span class="token key atrule">turn_off_action</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">deep_sleep.allow</span><span class="token punctuation">:</span> deep_sleep_1

<span class="token key atrule">button</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">platform</span><span class="token punctuation">:</span> restart
    <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">"Restart ESP32C3"</span></code>`),s(t);var o=a(t,6),d=e(o);n(d,()=>`<code class="language-bash">pipx <span class="token function">install</span> esphome <span class="token comment"># If you don't have pipx installed, you can install it using your package manager </span>
esphome run sensor.yaml</code>`),s(o);var p=a(o,30),y=e(p);n(y,()=>`<code class="language-yaml"><span class="token key atrule">esphome</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> my<span class="token punctuation">-</span>valve
  <span class="token key atrule">on_boot</span><span class="token punctuation">:</span>
    <span class="token key atrule">priority</span><span class="token punctuation">:</span> <span class="token number">800.0</span> <span class="token comment"># Run it when the whole firmware is already initialized</span>
    <span class="token key atrule">then</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">lambda</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>  <span class="token comment"># Support maintaining the state of the valve during deep sleep</span>
          gpio_deep_sleep_hold_dis();
          gpio_hold_dis(GPIO_NUM_3);
          
<span class="token key atrule">esp32</span><span class="token punctuation">:</span>
  <span class="token key atrule">board</span><span class="token punctuation">:</span> lolin_c3_mini 
  <span class="token key atrule">framework</span><span class="token punctuation">:</span>
    <span class="token key atrule">type</span><span class="token punctuation">:</span> esp<span class="token punctuation">-</span>idf

<span class="token comment"># Enable logging</span>
<span class="token key atrule">logger</span><span class="token punctuation">:</span>

<span class="token comment"># Enable Home Assistant API</span>
<span class="token key atrule">api</span><span class="token punctuation">:</span>

<span class="token key atrule">ota</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">platform</span><span class="token punctuation">:</span> esphome
    <span class="token key atrule">password</span><span class="token punctuation">:</span> <span class="token string">""</span>

<span class="token key atrule">wifi</span><span class="token punctuation">:</span>
  <span class="token key atrule">ssid</span><span class="token punctuation">:</span> <span class="token string">"my-ssid"</span>
  <span class="token key atrule">password</span><span class="token punctuation">:</span> <span class="token string">"your-secret-password"</span>
  <span class="token key atrule">output_power</span><span class="token punctuation">:</span> 8.5dB <span class="token comment"># If you use ESP32-C3 supermini you need to reduce the output power to avoid overheating issues and interference with the stock antenna</span>

<span class="token key atrule">switch</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">platform</span><span class="token punctuation">:</span> gpio
    <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">"Open the valve"</span>
    <span class="token key atrule">pin</span><span class="token punctuation">:</span> <span class="token number">3</span> 
    <span class="token key atrule">id</span><span class="token punctuation">:</span> relay
    <span class="token key atrule">restore_mode</span><span class="token punctuation">:</span> DISABLED

<span class="token key atrule">binary_sensor</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">platform</span><span class="token punctuation">:</span> status
    <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">"State of the valve"</span>

<span class="token key atrule">deep_sleep</span><span class="token punctuation">:</span>
  <span class="token key atrule">id</span><span class="token punctuation">:</span> deep_sleep_esp

<span class="token key atrule">script</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> go_to_sleep
    <span class="token key atrule">then</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">logger.log</span><span class="token punctuation">:</span> 
          <span class="token key atrule">format</span><span class="token punctuation">:</span> <span class="token string">"Going to deep sleep for %.0f seconds"</span>
          <span class="token key atrule">args</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">'id(sleep_duration).state'</span><span class="token punctuation">]</span>
      <span class="token punctuation">-</span> <span class="token key atrule">lambda</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>
          gpio_deep_sleep_hold_en();
          gpio_hold_en(GPIO_NUM_3);
      <span class="token punctuation">-</span> <span class="token key atrule">deep_sleep.enter</span><span class="token punctuation">:</span>
          <span class="token key atrule">id</span><span class="token punctuation">:</span> deep_sleep_esp
          <span class="token key atrule">sleep_duration</span><span class="token punctuation">:</span> <span class="token tag">!lambda</span> <span class="token string">'return id(sleep_duration).state * 1000;'</span>
          
<span class="token key atrule">number</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">platform</span><span class="token punctuation">:</span> template
    <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">"Deep Sleep Duration"</span>
    <span class="token key atrule">id</span><span class="token punctuation">:</span> sleep_duration
    <span class="token key atrule">optimistic</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">min_value</span><span class="token punctuation">:</span> <span class="token number">1</span>
    <span class="token key atrule">max_value</span><span class="token punctuation">:</span> <span class="token number">28800</span>  <span class="token comment"># support deep sleep for all the night</span>
    <span class="token key atrule">step</span><span class="token punctuation">:</span> <span class="token number">1</span>
    <span class="token key atrule">unit_of_measurement</span><span class="token punctuation">:</span> <span class="token string">"s"</span>
    <span class="token key atrule">mode</span><span class="token punctuation">:</span> box
    <span class="token key atrule">initial_value</span><span class="token punctuation">:</span> <span class="token number">3600</span> <span class="token comment"># default minimum cycle time of 1 hour</span>

<span class="token key atrule">button</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">platform</span><span class="token punctuation">:</span> template
    <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">"Go to Deep Sleep"</span>
    <span class="token key atrule">on_press</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">script.execute</span><span class="token punctuation">:</span> go_to_sleep</code>`),s(p);var c=a(p,8),f=e(c);n(f,()=>'<code class="language-bash">esphome run termal_actuator.yaml</code>'),s(c),_(16),w(h,r)},$$slots:{default:!0}}))}const R=Object.freeze(Object.defineProperty({__proto__:null,default:A,metadata:l},Symbol.toStringTag,{value:"Module"}));export{R as _,A as a};
