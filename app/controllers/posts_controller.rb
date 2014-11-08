class PostsController < ApplicationController
  respond_to :html, :json

  def index
    @post = Post.all
    respond_with(@posts) do |format|
      format.json { render :json => @post.as_json }
      format.html
    end
  end
  def show
    @post =Post.find(params[:id])
    respond_with(@post.as_json)
  end
  def create
    @post = Post.new(post_params)
    if @post.save
      render json: @post.as_json, status: :ok
    else
      render json: {post: @post.errors, status: :no_content}
    end    
  end
  def add_image
    @post =Post.find(params[:id]) 
    if @post.update_attributes(:picture_url=>params[:file])
      render json: @post.as_json, status: :ok
    else
      render json: {post: @post.errors, status: :no_content}
    end
  end
  def update
    @post =Post.find(params[:id])
    if @post.update_attributes(post_params)
      render json: @post.as_json, status: :ok
    else
      render json: {post: @post.errors, status: :no_content}
    end  
  end
  def destroy
    @post =Post.find(params[:id])
    if @post.destroy
      render json: {status: :ok}
    else
      render json: {post: @post.errors, status: :no_content}
    end
  end
  private

  def post_params
    params.fetch(:post, {}).permit(:title,:description,:picture_url)
  end
end
