<?php 
namespace HempEmpire;
use Illuminate\Database\Eloquent\Model;



class Mail extends Model 
{
	protected $fillable = ['receiver_id', 'sender_id', 'title', 'content', 'viewed', 'receiver_deleted', 'sender_deleted', 'notified', 'date'];
	protected $visible = ['id', 'author', 'title', 'content', 'date'];
	protected $appends = ['author'];
	public $timestamps = false;



	public function receiver()
	{
		return $this->belongsTo(Player::class, 'receiver_id');
	}

	public function sender()
	{
		return $this->belongsTo(Player::class, 'sender_id');
	}

	public function getAuthorAttribute()
	{
		return $this->sender->name;
	}

    public function scopeUnreaded($query)
    {
    	return $query->where('viewed', '=', false);
    }

    public function scopeReaded($query)
    {
    	return $query->where('viewed', '=', true);
    }
}
