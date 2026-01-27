/* ==========================================
   DEVICE DETECTION & AUTO-SIZING
   Ye file apni existing script.js ke SAATH use karein
   ========================================== */

// Device Detection System
(function() {
  'use strict';
  
  console.log('🚀 Device Detection Script Loaded!');
  
  // Detect device type and characteristics
  const deviceInfo = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTablet: /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768,
    isDesktop: window.innerWidth >= 1024,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    touchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    pixelRatio: window.devicePixelRatio || 1
  };
  
  // Function to apply device-specific optimizations
  function applyDeviceOptimizations() {
    const root = document.documentElement;
    
    // Remove all device classes first
    document.body.classList.remove(
      'mobile-device',
      'tablet-device',
      'desktop-device',
      'ios-device',
      'android-device',
      'retina-display',
      'touch-device',
      'mobile-landscape',
      'mobile-portrait'
    );
    
    // Detect and apply device type
    if (deviceInfo.isMobile) {
      root.style.setProperty('--base-font-size', '14px');
      root.style.setProperty('--container-padding', '15px');
      root.style.setProperty('--video-max-width', '220px');
      
      document.body.classList.add('mobile-device');
      console.log('📱 Mobile Device Detected');
      
      // Mobile orientation
      if (deviceInfo.orientation === 'landscape') {
        document.body.classList.add('mobile-landscape');
        console.log('📱🔄 Landscape mode');
      } else {
        document.body.classList.add('mobile-portrait');
        console.log('📱📱 Portrait mode');
      }
      
    } else if (deviceInfo.isTablet) {
      root.style.setProperty('--base-font-size', '15px');
      root.style.setProperty('--container-padding', '20px');
      root.style.setProperty('--video-max-width', '260px');
      
      document.body.classList.add('tablet-device');
      console.log('📱 Tablet Device Detected');
      
    } else if (deviceInfo.isDesktop) {
      root.style.setProperty('--base-font-size', '16px');
      root.style.setProperty('--container-padding', '25px');
      root.style.setProperty('--video-max-width', '300px');
      
      document.body.classList.add('desktop-device');
      console.log('💻 Desktop Device Detected');
    }
    
    // Platform specific
    if (deviceInfo.isIOS) {
      document.body.classList.add('ios-device');
      console.log('🍎 iOS Device');
    }
    
    if (deviceInfo.isAndroid) {
      document.body.classList.add('android-device');
      console.log('🤖 Android Device');
    }
    
    // High pixel density (Retina)
    if (deviceInfo.pixelRatio > 1.5) {
      document.body.classList.add('retina-display');
      console.log('✨ High-resolution display (Retina)');
    }
    
    // Touch device
    if (deviceInfo.touchDevice) {
      document.body.classList.add('touch-device');
      console.log('👆 Touch device detected');
    }
    
    // Log device info
    console.log('📊 Device Info:', {
      Type: deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop',
      Screen: `${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`,
      Orientation: deviceInfo.orientation,
      Touch: deviceInfo.touchDevice ? 'Yes' : 'No',
      'Pixel Ratio': deviceInfo.pixelRatio
    });
  }
  
  // Handle orientation changes
  function handleOrientationChange() {
    const newOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    
    if (newOrientation !== deviceInfo.orientation) {
      deviceInfo.orientation = newOrientation;
      deviceInfo.screenWidth = window.innerWidth;
      deviceInfo.screenHeight = window.innerHeight;
      
      console.log(`🔄 Orientation changed to: ${newOrientation}`);
      console.log(`📏 New size: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`);
      
      applyDeviceOptimizations();
    }
  }
  
  // Handle window resize
  function handleResize() {
    const oldWidth = deviceInfo.screenWidth;
    deviceInfo.screenWidth = window.innerWidth;
    deviceInfo.screenHeight = window.innerHeight;
    
    // Re-check device type on significant changes
    const widthChange = Math.abs(oldWidth - deviceInfo.screenWidth);
    if (widthChange > 50) {
      deviceInfo.isMobile = window.innerWidth < 768;
      deviceInfo.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      deviceInfo.isDesktop = window.innerWidth >= 1024;
      
      console.log(`📏 Significant resize: ${oldWidth}px → ${deviceInfo.screenWidth}px`);
      applyDeviceOptimizations();
    }
    
    handleOrientationChange();
  }
  
  // Debounce function for performance
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Prevent double-tap zoom on iOS
  if (deviceInfo.isMobile) {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });
    
    console.log('🚫 Double-tap zoom prevented');
  }
  
  // Prevent pull-to-refresh on mobile
  if (deviceInfo.isMobile) {
    let touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
      const touchY = e.touches[0].clientY;
      const touchDiff = touchY - touchStartY;
      
      if (touchDiff > 0 && window.scrollY === 0) {
        e.preventDefault();
      }
    }, { passive: false });
    
    console.log('🚫 Pull-to-refresh prevented');
  }
  
  // Viewport height fix for mobile browsers (address bar issue)
  function setVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  // Apply initial optimizations
  applyDeviceOptimizations();
  setVh();
  
  // Event listeners
  window.addEventListener('resize', debounce(handleResize, 250));
  window.addEventListener('orientationchange', debounce(handleOrientationChange, 250));
  window.addEventListener('resize', debounce(setVh, 250));
  
  // Log when everything is ready
  console.log('✅ Device detection complete and ready!');
  
  // Export device info for debugging (console me check kar sakte ho)
  window.deviceInfo = deviceInfo;
  console.log('💡 Tip: Type "deviceInfo" in console to see device details');
  
})();

// Helper function to check device type (optional, for your use)
function isPhone() {
  return window.innerWidth < 768;
}

function isTablet() {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

function isDesktop() {
  return window.innerWidth >= 1024;
}

console.log('🎯 Device helper functions ready: isPhone(), isTablet(), isDesktop()');
