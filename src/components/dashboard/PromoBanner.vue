<template>
  <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-10 shadow-2xl shadow-indigo-500/30 group">
    
    <!-- Animated Background Elements -->
    <div class="absolute top-0 right-0 p-4 opacity-20 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-6">
       <UIcon name="i-heroicons-sparkles" class="w-80 h-80" />
    </div>
     <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-colors duration-500"></div>
     <div class="absolute top-20 right-40 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>

    <div class="relative z-10 max-w-xl">
      <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase mb-4 border border-white/20">
        <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
        Online Course
      </span>
      <h2 class="text-4xl lg:text-5xl font-extrabold leading-tight mb-8 drop-shadow-sm">Sharpen Your Skills with <br/> Professional <span class="text-yellow-300 underline decoration-wavy decoration-2 underline-offset-4">Online Courses</span></h2>
      <div class="flex items-center gap-4">
          <UButton 
            label="Join Now" 
            color="black" 
            size="xl" 
            variant="solid" 
            class="rounded-full px-8 py-4 font-bold shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 bg-gray-900 border-2 border-transparent hover:border-white/20" 
            trailing-icon="i-heroicons-arrow-right" 
          />
          <div class="flex items-center -space-x-3 ml-4">
              <UAvatar src="https://randomuser.me/api/portraits/women/42.jpg" size="sm" class="ring-2 ring-indigo-500" />
              <UAvatar src="https://randomuser.me/api/portraits/men/32.jpg" size="sm" class="ring-2 ring-indigo-500" />
              <UAvatar src="https://randomuser.me/api/portraits/women/22.jpg" size="sm" class="ring-2 ring-indigo-500" />
              <div class="w-8 h-8 rounded-full bg-white/20 ring-2 ring-indigo-500 flex items-center justify-center text-[10px] font-bold">+12k</div>
          </div>
      </div>
    </div>
  </div>
</template>
