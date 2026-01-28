<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('asset_type');
            $table->tinyInteger('condition');
            $table->json('features')->nullable();
            $table->decimal('price', 15, 2);
            $table->decimal('taxes', 15, 2)->default(0);
            $table->decimal('income', 15, 2)->default(0);
            $table->decimal('expenditure', 15, 2)->default(0);
            $table->string('external_id')->unique()->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
