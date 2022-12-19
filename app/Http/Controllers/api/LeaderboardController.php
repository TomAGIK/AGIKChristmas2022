<?php

namespace App\Http\Controllers\api;

use App\Models\Leaderboard;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return response()->json(
            Leaderboard::orderBy('score', 'DESC')->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string',
            'score' => 'required|integer',
        ]);
        $leaderboard = Leaderboard::where('name', $request->name)
                ->where('email', $request->email)
                ->first();

        if (isset($leaderboard)) {
            if ($leaderboard->score <= $request->score) {
                $leaderboard->score = $request->score;
                $leaderboard->attempts++;
                $leaderboard->save();
            }
        }
        else {
            $leaderboard = new Leaderboard;
            $leaderboard->fill($request->all());
            $leaderboard->attempts = 1;
            $leaderboard->save();
        }

        $collection = collect(Leaderboard::orderBy('score', 'DESC')->get());
        $data = $collection->where('name', $request->name)
                ->where('email', $request->email);
        $leaderboard->rank = $data->keys()->first() + 1;

        return response()->json($leaderboard);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Leaderboard $leaderboard)
    {
        //
        return response()->json($leaderboard);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Leaderboard $leaderboard)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Leaderboard $leaderboard)
    {
        //
    }
}
