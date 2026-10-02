<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $subject
 * @property string $body
 */
#[Fillable(['name', 'subject', 'body'])]
class CommunicationTemplate extends Model {}
